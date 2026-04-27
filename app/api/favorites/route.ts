import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getCurrentUser } from "@/lib/auth"
import { getDb } from "@/lib/mongodb"
import { products } from "@/lib/products"

export async function GET() {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ favorites: [] })
  }

  const db = await getDb()
  const favorites = await db
    .collection("favorites")
    .find({ userId: new ObjectId(user.id) })
    .sort({ createdAt: -1 })
    .toArray()

  return NextResponse.json({
    favorites: favorites.map((favorite) => favorite.productSnapshot),
  })
}

export async function POST(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: "Войдите в аккаунт, чтобы добавлять товары в избранное." }, { status: 401 })
  }

  const body = (await request.json().catch(() => null)) as { productId?: number } | null
  const productId = Number(body?.productId)
  const product = products.find((item) => item.id === productId)

  if (!product) {
    return NextResponse.json({ error: "Товар не найден." }, { status: 404 })
  }

  const db = await getDb()
  await db.collection("favorites").updateOne(
    {
      userId: new ObjectId(user.id),
      productId: product.id,
    },
    {
      $set: {
        productSnapshot: product,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        userId: new ObjectId(user.id),
        productId: product.id,
        createdAt: new Date(),
      },
    },
    { upsert: true },
  )

  return NextResponse.json({ favorite: product })
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: "Войдите в аккаунт." }, { status: 401 })
  }

  const body = (await request.json().catch(() => null)) as { productId?: number } | null
  const productId = Number(body?.productId)

  if (!productId) {
    return NextResponse.json({ error: "Товар не найден." }, { status: 404 })
  }

  const db = await getDb()
  await db.collection("favorites").deleteOne({
    userId: new ObjectId(user.id),
    productId,
  })

  return NextResponse.json({ ok: true })
}
