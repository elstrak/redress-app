"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Product } from "./products"

export interface CartItem {
  product: Product
  size: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, size: string) => void
  removeFromCart: (productId: number, size: string) => void
  updateQuantity: (productId: number, size: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addToCart = (product: Product, size: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.size === size)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === size ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...prev, { product, size, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: number, size: string) => {
    setItems((prev) => prev.filter((item) => !(item.product.id === productId && item.size === size)))
  }

  const updateQuantity = (productId: number, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size)
      return
    }
    setItems((prev) =>
      prev.map((item) => (item.product.id === productId && item.size === size ? { ...item, quantity } : item)),
    )
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within CartProvider")
  return context
}
