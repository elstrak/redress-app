import { readFile } from "node:fs/promises"
import path from "node:path"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getCurrentUser } from "@/lib/auth"
import { getDb } from "@/lib/mongodb"
import { products } from "@/lib/products"

export const runtime = "nodejs"

const FASHN_RUN_URL = "https://api.fashn.ai/v1/run"
const FASHN_STATUS_URL = "https://api.fashn.ai/v1/status"
const MAX_UPLOAD_SIZE = 8 * 1024 * 1024
const POLL_INTERVAL_MS = 1500
const MAX_POLL_ATTEMPTS = 24

type FashnRunResponse = {
  id?: string
  error?: unknown
  message?: string
}

type FashnStatusResponse = {
  id: string
  status: "starting" | "in_queue" | "processing" | "completed" | "failed"
  output?: string[]
  error?: {
    name?: string
    message?: string
  } | null
}

function jsonError(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status })
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function mimeFromPath(filePath: string) {
  const extension = path.extname(filePath).toLowerCase()

  if (extension === ".png") return "image/png"
  if (extension === ".webp") return "image/webp"
  if (extension === ".gif") return "image/gif"

  return "image/jpeg"
}

async function fileToDataUrl(file: File) {
  const bytes = Buffer.from(await file.arrayBuffer())
  return `data:${file.type};base64,${bytes.toString("base64")}`
}

async function publicImageToDataUrl(imagePath: string) {
  const normalizedPath = imagePath.split("?")[0].replace(/^\/+/, "")
  const absolutePath = path.join(process.cwd(), "public", normalizedPath)
  const bytes = await readFile(absolutePath)
  return `data:${mimeFromPath(normalizedPath)};base64,${bytes.toString("base64")}`
}

async function pollPrediction(id: string, apiKey: string) {
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    await sleep(POLL_INTERVAL_MS)

    const response = await fetch(`${FASHN_STATUS_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      cache: "no-store",
    })

    const data = (await response.json()) as FashnStatusResponse

    if (!response.ok) {
      throw new Error(data.error?.message || `FASHN status request failed with ${response.status}`)
    }

    if (data.status === "completed") {
      const resultImage = data.output?.[0]
      if (!resultImage) {
        throw new Error("FASHN completed the prediction without an output image")
      }

      return {
        id: data.id,
        resultImage,
      }
    }

    if (data.status === "failed") {
      throw new Error(data.error?.message || data.error?.name || "FASHN failed to generate the try-on image")
    }
  }

  throw new Error("FASHN generation timed out. Try again in a moment.")
}

export async function POST(request: Request) {
  const apiKey = process.env.FASHN_API_KEY

  if (!apiKey) {
    return jsonError("FASHN_API_KEY is not configured yet.", 503)
  }

  const user = await getCurrentUser()

  if (!user) {
    return jsonError("Войдите в аккаунт, чтобы сохранять AI-примерки.", 401)
  }

  let formData: FormData

  try {
    formData = await request.formData()
  } catch {
    return jsonError("Send the try-on request as multipart form data.")
  }

  const userPhoto = formData.get("userPhoto")
  const productId = Number(formData.get("productId"))

  if (!(userPhoto instanceof File)) {
    return jsonError("Upload a full-body photo to start the try-on.")
  }

  if (!userPhoto.type.startsWith("image/")) {
    return jsonError("The uploaded file must be an image.")
  }

  if (userPhoto.size > MAX_UPLOAD_SIZE) {
    return jsonError("The uploaded photo is too large. Please use an image up to 8 MB.")
  }

  const product = products.find((item) => item.id === productId)

  if (!product) {
    return jsonError("Product not found.", 404)
  }

  try {
    const modelImage = await fileToDataUrl(userPhoto)
    const garmentImage = await publicImageToDataUrl(product.tryOnImage || product.images[0])

    const runResponse = await fetch(FASHN_RUN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model_name: "tryon-v1.6",
        inputs: {
          model_image: modelImage,
          garment_image: garmentImage,
          category: product.tryOnCategory || "auto",
          garment_photo_type: product.tryOnGarmentPhotoType || "auto",
          mode: "balanced",
          num_samples: 1,
          output_format: "jpeg",
          return_base64: true,
        },
      }),
    })

    const runData = (await runResponse.json()) as FashnRunResponse

    if (!runResponse.ok || !runData.id) {
      return jsonError(runData.message || "FASHN did not accept the try-on request.", runResponse.status, runData)
    }

    const result = await pollPrediction(runData.id, apiKey)
    const db = await getDb()
    const createdAt = new Date()
    const savedTryOn = await db.collection("tryOns").insertOne({
      userId: new ObjectId(user.id),
      productId: product.id,
      productSnapshot: product,
      userPhoto: modelImage,
      resultPhoto: result.resultImage,
      predictionId: result.id,
      createdAt,
    })

    return NextResponse.json({
      id: savedTryOn.insertedId.toString(),
      resultImage: result.resultImage,
      predictionId: result.id,
      createdAt,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected try-on generation error."
    return jsonError(message, 500)
  }
}
