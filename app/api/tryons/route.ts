import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getCurrentUser } from "@/lib/auth"
import { getDb } from "@/lib/mongodb"

export async function GET() {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ results: [] })
  }

  const db = await getDb()
  const results = await db
    .collection("tryOns")
    .find({ userId: new ObjectId(user.id) })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray()

  return NextResponse.json({
    results: results.map((result) => ({
      id: result._id.toString(),
      product: result.productSnapshot,
      userPhoto: result.userPhoto,
      resultPhoto: result.resultPhoto,
      createdAt: result.createdAt,
    })),
  })
}
