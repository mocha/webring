"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useFilterStore } from "@/stores/filters"

// This component doesn't render anything; it just synchronizes URL parameters with filter state
export default function FilterInitializer() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { selectedCategory, selectedRinglet, setCategory, setRinglet } = useFilterStore()

  // Initialize filters from URL parameters on component mount
  useEffect(() => {
    const categoryParam = searchParams.get("category")
    const ringletParam = searchParams.get("ringlet")

    console.log("URL params:", { categoryParam, ringletParam })
    console.log("Current filter state:", { selectedCategory, selectedRinglet })

    // Only update if the parameters are different from current state
    if (categoryParam !== selectedCategory) {
      console.log("Setting category from URL:", categoryParam)
      setCategory(categoryParam)
    }
    
    if (ringletParam !== selectedRinglet) {
      console.log("Setting ringlet from URL:", ringletParam)
      setRinglet(ringletParam)
    }
  // Only depend on searchParams to prevent circular dependencies
  }, [searchParams, setCategory, setRinglet])

  // Update URL when filters change
  useEffect(() => {
    console.log("Filter state changed:", { selectedCategory, selectedRinglet })
    
    // Create a new URLSearchParams instance
    const params = new URLSearchParams()
    
    // Add parameters only if they have values
    if (selectedCategory) {
      params.set("category", selectedCategory)
    }
    
    if (selectedRinglet) {
      params.set("ringlet", selectedRinglet)
    }
    
    // Convert params to string
    const queryString = params.toString()
    console.log("New query string:", queryString)
    
    // Update URL without refreshing the page
    const url = queryString ? `${pathname}?${queryString}` : pathname
    router.replace(url, { scroll: false })
  }, [selectedCategory, selectedRinglet, pathname, router])

  // This component doesn't render anything
  return null
} 