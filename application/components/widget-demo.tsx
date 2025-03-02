"use client"

import { ArrowLeft, ArrowRight, Shuffle } from "lucide-react"

interface WidgetDemoProps {
  ringlet?: {
    id: string;
    name: string;
    url?: string;
  } | null;
  colorMode: "light" | "dark";
}

export default function WidgetDemo({ ringlet, colorMode }: WidgetDemoProps) {
  // Use the ringlet's URL if available, otherwise link to the directory with the ringlet filter
  const webringUrl = ringlet?.url || (ringlet?.id ? `/?ringlet=${ringlet.id}` : "https://webring.fun");
  const ringletName = ringlet?.name || null;
  
  return (
    <div className="space-y-4">
      <div
        className={`border ${colorMode === "dark" ? "border-gray-700" : "border-gray-200"} rounded-lg overflow-hidden relative`}
      >
        <div className="p-8 bg-background">
          <div className="h-32 bg-muted rounded flex items-center justify-center">
            <span className="text-muted-foreground">Your website content here</span>
          </div>
        </div>

        {/* Widget preview that matches actual widget styling */}
        <div
          className={`px-4 py-2 flex items-center justify-between text-sm absolute bottom-0 left-0 right-0 ${colorMode === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"}`}
          style={{ height: '40px', borderTop: colorMode === "dark" ? '1px solid #444' : '1px solid #e0e0e0' }}
        >
          <span className="webring-widget-description">
            🎉 This site is a member of {ringletName ? 'the' : ''} <a href={webringUrl} className="hover:underline">
              {ringletName ? `${ringletName} webring` : 'webring.fun'}!
            </a>
          </span>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded-md hover:bg-gray-200/20 flex items-center justify-center w-7 h-7" title="Previous site">
              <ArrowLeft size={16} />
              <span className="sr-only">Previous site</span>
            </button>
            <button className="p-1 rounded-md hover:bg-gray-200/20 flex items-center justify-center w-7 h-7" title="Random site">
              <Shuffle size={16} />
              <span className="sr-only">Random site</span>
            </button>
            <button className="p-1 rounded-md hover:bg-gray-200/20 flex items-center justify-center w-7 h-7" title="Next site">
              <ArrowRight size={16} />
              <span className="sr-only">Next site</span>
            </button>
          </div>
        </div>
      </div>
      
    </div>
  )
}

