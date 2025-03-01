"use client"

import { X, ExternalLink } from "lucide-react"
import type { Site } from "@/types"
import { useFilterStore } from "@/stores/filters"

interface SiteDetailModalProps {
  site: Site
  onClose: () => void
}

export default function SiteDetailModal({ site, onClose }: SiteDetailModalProps) {
  const { setCategory, setRinglet } = useFilterStore()

  const handleCategoryClick = (category: string) => {
    // Clear the ringlet filter and set the selected category
    setRinglet("")
    setCategory(category)
    onClose()
  }
  
  const handleRingletClick = (ringlet: string) => {
    // Clear the category filter and set the selected ringlet
    setCategory("")
    setRinglet(ringlet)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          borderLeft: `8px solid ${site.color || "#888888"}`,
        }}
      >
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-2xl font-bold">{site.name}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-muted">
            <X size={24} />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="p-6">
          {site.description && (
            <div className="mb-6">
              <p className="text-lg text-muted-foreground">{site.description}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Website</h3>
              <p className="mb-4">
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center"
                >
                  {site.url}
                  <ExternalLink size={16} className="ml-1" />
                </a>
              </p>

              <h3 className="text-sm font-medium text-muted-foreground mb-1">Owner</h3>
              <p className="mb-4">
                {site.owner}
                {site.owner_type && <span className="text-sm text-muted-foreground ml-1">({site.owner_type})</span>}
              </p>
            </div>

            <div>
              {site.website_categories && site.website_categories.length > 0 && (
                <>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {site.website_categories.map((category, i) => (
                      <button
                        key={i}
                        onClick={() => handleCategoryClick(category)}
                        className="bg-muted hover:bg-muted/80 rounded-full px-3 py-1 text-sm cursor-pointer transition-colors"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {site.ringlets && site.ringlets.length > 0 && (
                <>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Ringlets</h3>
                  <div className="flex flex-wrap gap-1">
                    {site.ringlets.map((ringlet, i) => (
                      <button
                        key={i}
                        onClick={() => handleRingletClick(ringlet)}
                        className="bg-muted hover:bg-muted/80 rounded-full px-3 py-1 text-sm cursor-pointer transition-colors"
                      >
                        {ringlet}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-lg font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Visit Website
              <ExternalLink size={18} className="ml-2" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

