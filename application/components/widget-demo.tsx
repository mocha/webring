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
  // Use the ringlet's actual URL if available, otherwise fallback to a generic webring URL
  const webringUrl = "https://webring.fun";
  
  return (
    <div className="space-y-4">
      <div
        className={`border ${colorMode === "dark" ? "border-gray-700" : "border-gray-200"} rounded-lg overflow-hidden`}
      >
        <div className="p-8 bg-background">
          <div className="h-32 bg-muted rounded flex items-center justify-center">
            <span className="text-muted-foreground">Your website content here</span>
          </div>
        </div>

        <div
          className={`px-4 py-2 flex items-center justify-between text-sm ${colorMode === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"}`}
        >
          <span>
            <a href={webringUrl} className="hover:underline">
              Member of {ringlet ? `the ${ringlet.name}` : "webring.fun"}
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
      
      <p className="text-xs text-muted-foreground text-center">
        This is a preview of how the webring widget will appear on your website.
      </p>
    </div>
  )
}

