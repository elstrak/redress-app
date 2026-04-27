import { NextResponse } from "next/server"
import {
  createSessionToken,
  getSessionCookieOptions,
  getUsersCollection,
  normalizeEmail,
  SESSION_COOKIE,
  verifyPassword,
} from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      email?: string
      password?: string
    } | null

    const email = normalizeEmail(body?.email || "")
    const password = body?.password || ""

    if (!email || !password) {
      return NextResponse.json({ error: "Введите email и пароль." }, { status: 400 })
    }

    const users = await getUsersCollection()
    const userDocument = await users.findOne({ email })

    if (!userDocument) {
      return NextResponse.json({ error: "Неверный email или пароль." }, { status: 401 })
    }

    const isValidPassword = await verifyPassword(password, userDocument.passwordSalt, userDocument.passwordHash)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Неверный email или пароль." }, { status: 401 })
    }

    const user = {
      id: userDocument._id.toString(),
      name: userDocument.name,
      email: userDocument.email,
    }

    const response = NextResponse.json({ user })
    response.cookies.set(SESSION_COOKIE, createSessionToken(user.id), getSessionCookieOptions())

    return response
  } catch {
    return NextResponse.json(
      { error: "Не удалось подключиться к MongoDB. Проверьте строку подключения и пользователя Atlas." },
      { status: 500 },
    )
  }
}
