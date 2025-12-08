import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { TryOnProvider } from "@/lib/tryon-context"

const _inter = Inter({ subsets: ["latin", "cyrillic"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "STYLEHUB - Интернет-магазин одежды",
  description: "Модная одежда с AI-примеркой онлайн",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className="font-sans antialiased">
        <CartProvider>
          <TryOnProvider>{children}</TryOnProvider>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
