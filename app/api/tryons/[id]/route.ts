import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getCurrentUser } from "@/lib/auth"
import { getDb } from "@/lib/mongodb"

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: "Войдите в аккаунт." }, { status: 401 })
  }

  const { id } = await params

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Примерка не найдена." }, { status: 404 })
  }

  const db = await getDb()
  await db.collection("tryOns").deleteOne({
    _id: new ObjectId(id),
    userId: new ObjectId(user.id),
  })

  return NextResponse.json({ ok: true })
}
