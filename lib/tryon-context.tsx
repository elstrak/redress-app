"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Product } from "./products"
import { useAuth } from "./auth-context"

export interface TryOnResult {
  id: string
  product: Product
  userPhoto: string
  resultPhoto: string
  createdAt: Date
}

interface TryOnContextType {
  results: TryOnResult[]
  isLoading: boolean
  addResult: (result: Omit<TryOnResult, "createdAt"> & { createdAt?: Date | string }) => void
  removeResult: (id: string) => Promise<void>
  refreshResults: () => Promise<void>
}

const TryOnContext = createContext<TryOnContextType | undefined>(undefined)

export function TryOnProvider({ children }: { children: ReactNode }) {
  const [results, setResults] = useState<TryOnResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const refreshResults = async () => {
    if (!user) {
      setResults([])
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/tryons", { cache: "no-store" })

      if (!response.ok) {
        setResults([])
        return
      }

      const data = (await response.json()) as {
        results: Array<Omit<TryOnResult, "createdAt"> & { createdAt: string }>
      }

      setResults(data.results.map((result) => ({ ...result, createdAt: new Date(result.createdAt) })))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshResults()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const addResult = (result: Omit<TryOnResult, "createdAt"> & { createdAt?: Date | string }) => {
    const newResult: TryOnResult = {
      ...result,
      createdAt: result.createdAt ? new Date(result.createdAt) : new Date(),
    }
    setResults((prev) => [newResult, ...prev])
  }

  const removeResult = async (id: string) => {
    const previousResults = results
    setResults((prev) => prev.filter((r) => r.id !== id))

    const response = await fetch(`/api/tryons/${id}`, { method: "DELETE" })

    if (!response.ok) {
      setResults(previousResults)
    }
  }

  return (
    <TryOnContext.Provider value={{ results, isLoading, addResult, removeResult, refreshResults }}>
      {children}
    </TryOnContext.Provider>
  )
}

export function useTryOn() {
  const context = useContext(TryOnContext)
  if (!context) throw new Error("useTryOn must be used within TryOnProvider")
  return context
}
