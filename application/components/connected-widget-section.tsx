"use client"

import { useState } from "react"
import WidgetDemo from "./widget-demo"
import { useRinglets } from "@/hooks/use-filters"
import { Copy, Check } from "lucide-react"

export default function ConnectedWidgetSection() {
  const [ringletId, setRingletId] = useState("")
  const [colorMode, setColorMode] = useState<"light" | "dark">("light")
  const [copied, setCopied] = useState(false)
  const { ringlets } = useRinglets()

  // Find the selected ringlet object
  const selectedRinglet = ringletId 
    ? ringlets?.find(r => r.id === ringletId) || null
    : null;

  const code = `<script src="https://webring.example.com/widget.js"></script>
<script>
  webring.init({
    ${ringletId ? `ringlet: "${ringletId}",\n    ` : ""}colormode: "${colorMode}"
  });
</script>`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Widget Code Generator */}
      <div className="space-y-4">
        <div className="flex gap-4 mb-4">
          <div className="space-y-1 flex-1">
            <label htmlFor="ringlet" className="text-sm font-medium">
              Ringlet (optional)
            </label>
            <select
              id="ringlet"
              value={ringletId}
              onChange={(e) => setRingletId(e.target.value)}
              className="w-full px-3 py-2 border rounded-md border-input bg-background"
            >
              <option value="">None</option>
              {ringlets?.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1 flex-1">
            <label htmlFor="colorMode" className="text-sm font-medium">
              Color Mode
            </label>
            <select
              id="colorMode"
              value={colorMode}
              onChange={(e) => setColorMode(e.target.value as "light" | "dark")}
              className="w-full px-3 py-2 border rounded-md border-input bg-background"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{code}</pre>
          <button
            onClick={copyToClipboard}
            className="absolute top-2 right-2 p-2 rounded-md bg-background/80 hover:bg-background transition-colors"
            aria-label="Copy code"
          >
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
        </div>
      </div>
      
      {/* Widget Preview Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Widget Preview</h3>
        <p className="mb-4">
          Here's how the widget will appear on your website:
        </p>
        <WidgetDemo 
          colorMode={colorMode} 
          ringlet={selectedRinglet ? {
            id: selectedRinglet.id,
            name: selectedRinglet.name,
            url: selectedRinglet.url
          } : null} 
        />
      </div>
    </div>
  )
} 