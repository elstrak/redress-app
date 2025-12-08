"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Product } from "./products"

export interface TryOnResult {
  id: string
  product: Product
  userPhoto: string
  resultPhoto: string
  createdAt: Date
}

interface TryOnContextType {
  results: TryOnResult[]
  addResult: (result: Omit<TryOnResult, "id" | "createdAt">) => void
  removeResult: (id: string) => void
}

const TryOnContext = createContext<TryOnContextType | undefined>(undefined)

export function TryOnProvider({ children }: { children: ReactNode }) {
  const [results, setResults] = useState<TryOnResult[]>([])

  const addResult = (result: Omit<TryOnResult, "id" | "createdAt">) => {
    const newResult: TryOnResult = {
      ...result,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    }
    setResults((prev) => [newResult, ...prev])
  }

  const removeResult = (id: string) => {
    setResults((prev) => prev.filter((r) => r.id !== id))
  }

  return <TryOnContext.Provider value={{ results, addResult, removeResult }}>{children}</TryOnContext.Provider>
}

export function useTryOn() {
  const context = useContext(TryOnContext)
  if (!context) throw new Error("useTryOn must be used within TryOnProvider")
  return context
}
