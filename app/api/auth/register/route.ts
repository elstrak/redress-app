import { NextResponse } from "next/server"
import {
  createSessionToken,
  ensureUserIndexes,
  getSessionCookieOptions,
  getUsersCollection,
  hashPassword,
  normalizeEmail,
  SESSION_COOKIE,
} from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      name?: string
      email?: string
      password?: string
    } | null

    const name = body?.name?.trim()
    const email = normalizeEmail(body?.email || "")
    const password = body?.password || ""

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Введите имя." }, { status: 400 })
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Введите корректный email." }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Пароль должен быть не короче 6 символов." }, { status: 400 })
    }

    await ensureUserIndexes()
    const users = await getUsersCollection()
    const existingUser = await users.findOne({ email })

    if (existingUser) {
      return NextResponse.json({ error: "Пользователь с таким email уже существует." }, { status: 409 })
    }

    const { passwordHash, passwordSalt } = await hashPassword(password)
    const result = await users.insertOne({
      name,
      email,
      passwordHash,
      passwordSalt,
      createdAt: new Date(),
    })

    const user = {
      id: result.insertedId.toString(),
      name,
      email,
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
