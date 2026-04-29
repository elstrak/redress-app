import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { TryOnProvider } from "@/lib/tryon-context"
import { AuthProvider } from "@/lib/auth-context"
import { FavoritesProvider } from "@/lib/favorites-context"

export const metadata: Metadata = {
  title: "LOOKLAB - Интернет-магазин одежды",
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
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <TryOnProvider>{children}</TryOnProvider>
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
