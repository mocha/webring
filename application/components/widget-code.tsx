"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { useRinglets } from "@/hooks/use-filters"

export default function WidgetCode() {
  const [copied, setCopied] = useState(false)
  const [ringlet, setRinglet] = useState("")
  const [colorMode, setColorMode] = useState("light")
  const { ringlets } = useRinglets()

  const code = `<script src="https://webring.fun/widget.js"></script>
<script>
  webring.init({
    ${ringlet ? `ringlet: "${ringlet}",\n    ` : ""}colormode: "${colorMode}"
  });
</script>`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <div className="space-y-1 flex-1">
          <label htmlFor="ringlet" className="text-sm font-medium">
            Ringlet (optional)
          </label>
          <select
            id="ringlet"
            value={ringlet}
            onChange={(e) => setRinglet(e.target.value)}
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
            onChange={(e) => setColorMode(e.target.value)}
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
      
      <div className="text-sm text-muted-foreground">
        <p>The widget will appear at the bottom of your website and allow visitors to navigate through the webring.</p>
        <p className="mt-2">You can also specify a <code>siteUrl</code> parameter if autodetection doesn't work correctly:</p>
        <pre className="bg-muted p-2 mt-1 rounded-lg overflow-x-auto text-xs">
          {`siteUrl: "https://your-exact-url.com",`}
        </pre>
        
        <p className="mt-2">If you're using a custom deployment or the widget isn't loading properly, you can set the <code>baseUrl</code> parameter:</p>
        <pre className="bg-muted p-2 mt-1 rounded-lg overflow-x-auto text-xs">
          {`baseUrl: "https://your-webring-installation.com",`}
        </pre>
      </div>
    </div>
  )
}

