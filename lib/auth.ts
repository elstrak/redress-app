import crypto from "node:crypto"
import { cookies } from "next/headers"
import { ObjectId, type Collection } from "mongodb"
import { getDb } from "@/lib/mongodb"

export const SESSION_COOKIE = "stylehub_session"

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

export interface UserDocument {
  _id: ObjectId
  name: string
  email: string
  passwordHash: string
  passwordSalt: string
  createdAt: Date
}

export interface SessionUser {
  id: string
  name: string
  email: string
}

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET

  if (!secret) {
    throw new Error("SESSION_SECRET is not configured.")
  }

  return secret
}

function base64Url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url")
}

function sign(value: string) {
  return crypto.createHmac("sha256", getSessionSecret()).update(value).digest("base64url")
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export async function getUsersCollection(): Promise<Collection<UserDocument>> {
  const db = await getDb()
  return db.collection<UserDocument>("users")
}

export async function ensureUserIndexes() {
  const users = await getUsersCollection()
  await users.createIndex({ email: 1 }, { unique: true })
}

export async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex")
  const passwordHash = await new Promise<string>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
        reject(error)
        return
      }

      resolve(derivedKey.toString("hex"))
    })
  })

  return { passwordHash, passwordSalt: salt }
}

export async function verifyPassword(password: string, salt: string, hash: string) {
  const candidateHash = await new Promise<string>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
        reject(error)
        return
      }

      resolve(derivedKey.toString("hex"))
    })
  })

  return crypto.timingSafeEqual(Buffer.from(candidateHash, "hex"), Buffer.from(hash, "hex"))
}

export function createSessionToken(userId: string) {
  const payload = {
    sub: userId,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  }
  const encodedPayload = base64Url(JSON.stringify(payload))
  return `${encodedPayload}.${sign(encodedPayload)}`
}

export function verifySessionToken(token: string) {
  const [encodedPayload, signature] = token.split(".")

  if (!encodedPayload || !signature || sign(encodedPayload) !== signature) {
    return null
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as {
      sub?: string
      exp?: number
    }

    if (!payload.sub || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload.sub
  } catch {
    return null
  }
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (!token) {
    return null
  }

  const userId = verifySessionToken(token)

  if (!userId || !ObjectId.isValid(userId)) {
    return null
  }

  const users = await getUsersCollection()
  const user = await users.findOne({ _id: new ObjectId(userId) })

  if (!user) {
    return null
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  }
}
