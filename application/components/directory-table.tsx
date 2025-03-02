"use client"

import { useState, useMemo, useEffect } from "react"
import { ExternalLink, ChevronDown } from "lucide-react"
import SiteDetailModal from "@/components/site-detail-modal"
import { useSites } from "@/hooks/use-sites"
import { useFilterStore } from "@/stores/filters"
import { isColorLight, darkenColor, getTextColorForBackground } from "@/utils/color"
import type { Site } from "@/types"
import { useCategories, useRinglets } from "@/hooks/use-filters"
import { useRouter, useSearchParams } from "next/navigation"

// Utility function to format category and ringlet names for display
const formatDisplayName = (name: string): string => {
  // Replace underscores and hyphens with spaces
  const withSpaces = name.replace(/[_-]/g, ' ');
  
  // Convert to sentence case (capitalize first letter of each word)
  return withSpaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function DirectoryTable() {
  const { sites, isLoading: sitesLoading, error: sitesError } = useSites()
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories()
  const { ringlets, isLoading: ringletsLoading, error: ringletsError } = useRinglets()
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const { selectedCategory, selectedRinglet, setCategory, setRinglet } = useFilterStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const isLoading = sitesLoading || categoriesLoading || ringletsLoading
  const error = sitesError || categoriesError || ringletsError
  
  // Initialize filters from URL on page load
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const ringletParam = searchParams.get('ringlet')
    
    // Only set the category if it exists in our categories list
    if (categoryParam && categories?.some(cat => cat === categoryParam)) {
      setCategory(categoryParam)
    }
    
    // Only set the ringlet if it exists in our ringlets list
    if (ringletParam && ringlets?.some(ring => ring.id === ringletParam)) {
      setRinglet(ringletParam)
    }
  }, [categories, ringlets, searchParams, setCategory, setRinglet])
  
  // Update URL when filters change
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Create a new URLSearchParams object
    const params = new URLSearchParams()
    
    // Add parameters only if they are selected
    if (selectedCategory) {
      params.set('category', selectedCategory)
    }
    
    if (selectedRinglet) {
      params.set('ringlet', selectedRinglet)
    }
    
    // Construct the new URL
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`
    
    // Update the URL without triggering a navigation/refresh
    window.history.replaceState({}, '', newUrl)
  }, [selectedCategory, selectedRinglet])

  // Add debug logging for filter changes
  useEffect(() => {
    console.log("DirectoryTable - Current filter state:", { selectedCategory, selectedRinglet })
  }, [selectedCategory, selectedRinglet]);

  const filteredSites = useMemo(() => {
    if (!sites) return []

    return sites.filter((site) => {
      // If no filters are selected
      if (!selectedCategory && !selectedRinglet) {
        return true
      }

      // Check if the site matches the selected category
      const matchesCategory =
        !selectedCategory || site.website_categories?.includes(selectedCategory)

      // Check if the site matches the selected ringlet
      const matchesRinglet =
        !selectedRinglet || site.ringlets?.includes(selectedRinglet)

      return matchesCategory && matchesRinglet
    })
  }, [sites, selectedCategory, selectedRinglet])

  if (isLoading) return <div className="text-center py-12">Loading directory...</div>
  if (error) return <div className="text-center py-12 text-red-500">Error loading directory</div>

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value || null;
    console.log("Category dropdown changed to:", newValue);
    setCategory(newValue);
  };

  const handleRingletChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value || null;
    console.log("Ringlet dropdown changed to:", newValue);
    setRinglet(newValue);
  };

  return (
    <>
      {/* Filters */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Dropdown */}
          <div className="relative">
            <div className="flex flex-col">
              <label htmlFor="category-select" className="text-lg font-medium mb-2">Show me sites about...</label>
              <div className="flex">
                <div className="relative w-full">
                  <select
                    id="category-select"
                    value={selectedCategory || ''}
                    onChange={handleCategoryChange}
                    className={`w-full p-2 border rounded-md ${selectedCategory ? 'rounded-r-none border-r-0' : ''} border-input bg-background appearance-none pr-10`}
                  >
                    <option value="">Everything</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {formatDisplayName(category)}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                {selectedCategory && (
                  <button
                    onClick={() => setCategory(null)}
                    className="px-4 border border-input border-l-0 bg-background rounded-r-md hover:bg-muted transition-colors flex items-center justify-center"
                    aria-label="Clear category selection"
                  >
                    <span className="text-muted-foreground font-medium text-lg">×</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Ringlet Dropdown */}
          <div className="relative">
            <div className="flex flex-col">
              <label htmlFor="ringlet-select" className="text-lg font-medium mb-2">From...</label>
              <div className="flex">
                <div className="relative w-full">
                  <select
                    id="ringlet-select"
                    value={selectedRinglet || ''}
                    onChange={handleRingletChange}
                    className={`w-full p-2 border rounded-md ${selectedRinglet ? 'rounded-r-none border-r-0' : ''} border-input bg-background appearance-none pr-10`}
                  >
                    <option value="">Everywhere</option>
                    {ringlets.map((ringlet) => (
                      <option key={ringlet.id} value={ringlet.id}>
                        {ringlet.name || formatDisplayName(ringlet.id)}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                {selectedRinglet && (
                  <button
                    onClick={() => setRinglet(null)}
                    className="px-4 border border-input border-l-0 bg-background rounded-r-md hover:bg-muted transition-colors flex items-center justify-center"
                    aria-label="Clear ringlet selection"
                  >
                    <span className="text-muted-foreground font-medium text-lg">×</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSites.length === 0 ? (
          <div className="text-2xl col-span-full text-center py-12 text-muted-foreground">
            😱 No websites match the selected filters! Try clearing a filter or two.
          </div>
        ) : (
          filteredSites.map((site) => {
            const siteColor = site.color || "#666666"
            const isLight = isColorLight(siteColor)
            const hoverColor = darkenColor(siteColor)
            const textColor = getTextColorForBackground(siteColor)
            const textColorWithOpacity = `${textColor === "black" ? "text-black" : "text-white"}`
            const textColorFaded = `${textColor === "black" ? "text-black/70" : "text-white/90"}`
            const bgColorFaded = `${textColor === "black" ? "bg-black/10" : "bg-white/20"}`
            const borderColorFaded = `${textColor === "black" ? "border-black/20" : "border-white/40"}`
            const ringColorFaded = `${textColor === "black" ? "ring-black/20" : "ring-white/40"}`
            const hoverBgColorFaded = `${textColor === "black" ? "hover:bg-black/10" : "hover:bg-white/20"}`

            return (
              <div
                key={site.url}
                className="group relative rounded-lg p-6 transition-all cursor-pointer flex flex-col overflow-hidden"
                onClick={() => setSelectedSite(site)}
                style={{
                  backgroundColor: siteColor,
                }}
              >
                {/* Hover overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    backgroundColor: hoverColor,
                  }}
                />

                <div className="flex-1 relative z-10">
                  <div className="flex justify-end mb-2">
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-md transition-colors ${hoverBgColorFaded}`}
                      onClick={(e) => e.stopPropagation()}
                      title={`Visit ${site.name}`}
                    >
                      <ExternalLink size={18} className={textColorFaded} />
                      <span className="sr-only">Visit {site.name}</span>
                    </a>
                  </div>

                  <h3
                    className={`text-2xl sm:text-3xl font-bold mb-3 leading-tight ${textColorWithOpacity}`}
                  >
                    {site.name}
                  </h3>

                  <p className={`text-sm mb-4 ${textColorFaded}`}>
                    <span className="inline-block">
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {new URL(site.url).hostname}
                      </a>
                    </span>
                    <span className="mx-2">•</span>
                    <span>
                      {site.owner}
                      {site.owner_type && <span className="text-xs ml-1">({site.owner_type})</span>}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 relative z-10">
                  {site.website_categories?.map((category, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        bgColorFaded + " " + textColorWithOpacity
                      } ${
                        selectedCategory === category
                          ? ringColorFaded + " ring-2"
                          : ""
                      }`}
                    >
                      {formatDisplayName(category)}
                    </span>
                  ))}
                  {site.ringlets?.map((ringlet, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        "border " + borderColorFaded + " " + textColorWithOpacity
                      } ${
                        selectedRinglet === ringlet
                          ? "border-2 " + (textColor === "black" ? "border-black/40" : "border-white/60")
                          : ""
                      }`}
                    >
                      {formatDisplayName(ringlet)}
                    </span>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>

      {selectedSite && <SiteDetailModal site={selectedSite} onClose={() => setSelectedSite(null)} />}
    </>
  )
}

