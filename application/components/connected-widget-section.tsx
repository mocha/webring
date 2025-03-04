"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

export default function ConnectedWidgetSection() {
  const [copied, setCopied] = useState(false)

  const widgetCode = `<script src="https://webring.fun/widget.js"></script>
<script>
  webring.init({
    type: "bar"
  });
</script>`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(widgetCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-lg">
          The webring widget comes in three styles to match your site's design. Each widget provides navigation between sites in your ringlet, with options for customization.
        </p>

        <div className="space-y-4">
          <p className="font-medium">Widget Code:</p>
          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              {widgetCode}
            </pre>
            <button
              onClick={copyToClipboard}
              className="absolute top-2 right-2 p-2 rounded-md bg-background/80 hover:bg-background transition-colors"
              aria-label="Copy code"
            >
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      </div>

      <hr className="my-8" />
      
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Customizing your widget</h3>
        <p>
          Check out some example pages to learn about <strong>bar</strong>, <strong>box</strong>, and <strong>static</strong> widgets!
          Now with a <em>live</em> Configurator!
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li><a href="/examples/widget-ex-bar.html" className="text-primary hover:underline">Bar Widget Examples</a></li>
          <li><a href="/examples/widget-ex-box.html" className="text-primary hover:underline">Box Widget Examples</a></li>
          <li><a href="/examples/widget-ex-static.html" className="text-primary hover:underline">Static Widget Examples</a></li>
        </ul>
      </div>
    </div>
  )
} 