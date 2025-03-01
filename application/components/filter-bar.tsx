"use client"

import { ChevronDown } from "lucide-react"
import { useRinglets } from "@/hooks/use-filters"
import { useFilterStore } from "@/stores/filters"

export default function FilterBar() {
  const { ringlets } = useRinglets()
  const { selectedRinglet, setRinglet } = useFilterStore()

  const ringletName = selectedRinglet 
    ? ringlets.find(r => r.id === selectedRinglet)?.name || selectedRinglet
    : "All Ringlets";

  return (
    <div className="relative">
      <div className="flex">
        <select
          value={selectedRinglet || ''}
          onChange={(e) => setRinglet(e.target.value || null)}
          className="w-full p-2 border rounded-md border-input bg-background appearance-none pr-10"
        >
          <option value="">All Ringlets</option>
          {ringlets.map((ringlet) => (
            <option key={ringlet.id} value={ringlet.id}>
              {ringlet.name}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  )
}

