"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import type { Product } from "./products"
import { useAuth } from "./auth-context"

interface FavoritesContextType {
  favorites: Product[]
  favoriteIds: number[]
  isLoading: boolean
  isFavorite: (productId: number) => boolean
  toggleFavorite: (product: Product) => Promise<void>
  removeFavorite: (productId: number) => Promise<void>
  refreshFavorites: () => Promise<void>
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const favoriteIds = useMemo(() => favorites.map((product) => product.id), [favorites])

  const refreshFavorites = async () => {
    if (!user) {
      setFavorites([])
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/favorites", { cache: "no-store" })

      if (!response.ok) {
        setFavorites([])
        return
      }

      const data = (await response.json()) as { favorites: Product[] }
      setFavorites(data.favorites)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshFavorites()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const isFavorite = (productId: number) => favoriteIds.includes(productId)

  const toggleFavorite = async (product: Product) => {
    if (!user) {
      return
    }

    const wasFavorite = isFavorite(product.id)
    const previousFavorites = favorites

    setFavorites((prev) =>
      wasFavorite ? prev.filter((item) => item.id !== product.id) : [product, ...prev.filter((item) => item.id !== product.id)],
    )

    const response = await fetch("/api/favorites", {
      method: wasFavorite ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id }),
    })

    if (!response.ok) {
      setFavorites(previousFavorites)
    }
  }

  const removeFavorite = async (productId: number) => {
    if (!user) {
      return
    }

    const previousFavorites = favorites
    setFavorites((prev) => prev.filter((item) => item.id !== productId))

    const response = await fetch("/api/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    })

    if (!response.ok) {
      setFavorites(previousFavorites)
    }
  }

  return (
    <FavoritesContext.Provider
      value={{ favorites, favoriteIds, isLoading, isFavorite, toggleFavorite, removeFavorite, refreshFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error("useFavorites must be used within FavoritesProvider")
  return context
}
