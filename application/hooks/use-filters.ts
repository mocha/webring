"use client"

import { useState, useEffect } from "react"
import type { Ringlet } from "@/types"

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        // Fetch categories from our updated data module that reads from all.json
        const { getAllCategories } = await import("@/lib/data")
        const data = await getAllCategories()
        setCategories(data)
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch categories"))
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, isLoading, error }
}

export function useRinglets() {
  const [ringlets, setRinglets] = useState<Ringlet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchRinglets() {
      try {
        // Fetch ringlets from our updated data module that reads from all.json
        const { getRinglets } = await import("@/lib/data")
        const data = await getRinglets()
        setRinglets(data)
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch ringlets"))
        setIsLoading(false)
      }
    }

    fetchRinglets()
  }, [])

  return { ringlets, isLoading, error }
}

