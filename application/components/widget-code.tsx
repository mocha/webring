"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

export default function WidgetCode() {
  const [copied, setCopied] = useState(false)

  const code = `<script src="https://webring.fun/widget.js"></script>
<script>
  webring.init({
    // Optional: specify a ringlet ID to only show websites from that ringlet
    // ringlet: "ringlet_id",
    
    // Optional: set to "dark" or "light" to match your website's theme
    colormode: "light"
    
    // Optional: set position ("bottom" is default)
    // position: "bottom"
  });
</script>

<!-- 
Ringlet Link Behavior:
1. No ringlet specified: "This site is a member of webring.fun!"
2. Ringlet specified without URL: "This site is a member of the {ringlet.name} webring!" → links to webring.fun/?ringlet={id}
3. Ringlet with URL: "This site is a member of the {ringlet.name} webring!" → links to the ringlet's URL
-->
`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
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
  )
} 