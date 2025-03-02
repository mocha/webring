"use client"

import { useState, useEffect } from "react"
import type { Site } from "@/types"

export function useSites() {
  const [sites, setSites] = useState<Site[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchSites() {
      try {
        // Fetch sites from our updated data module that reads from all.json
        const { getSites } = await import("@/lib/data")
        const data = await getSites()
        setSites(data)
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch sites"))
        setIsLoading(false)
      }
    }

    fetchSites()
  }, [])

  return { sites, isLoading, error }
}

