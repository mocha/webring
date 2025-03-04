import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import Link from "next/link"
import { Home, Plus, DoorOpen } from "lucide-react"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "🎉 webring.fun",
  description: "A modern webring connecting personal websites across the internet",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Load widget script in the head */}
        <Script 
          src="/widget.js" 
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <header className="border-b border-border fixed top-0 left-0 right-0 w-full bg-background z-50">
          <div className="container mx-auto px-4 py-4 flex flex-row items-center justify-between gap-4">
            <Link href="/" className="text-xl font-bold flex items-center">
              🎉 webring.fun
            </Link>
            <nav>
              <ul className="flex items-center gap-6">
                <li>
                  <Link 
                    href="/join" 
                    className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    <DoorOpen size={18} className="mr-1" />
                    <span>Join the ring!</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <div className="pt-16">{children}</div>
        <footer className="border-t border-border py-2 text-center text-xs text-muted-foreground">
        <div className="container mx-auto">
          <p>Brought to you with ❤️ and 🌈 by <a href="https://github.com/mocha/" className="underline hover:text-primary">@mocha</a>, <a href="https://github.com/mocha/webring/blob/main/LICENSE" className="underline hover:text-primary">zero rights reserved</a>.</p>
        </div>
      </footer>
      
      {/* Single widget initialization script */}
      <Script id="webring-init" strategy="afterInteractive">
        {`
          // Global variable to track if widget is initialized
          window.__webringInitialized = false;
          
          function initWidget() {
            // Only initialize once
            if (window.__webringInitialized) return;
            
            if (typeof window.webring !== 'undefined') {
              // Remove any existing widgets first
              const existingWidgets = document.querySelectorAll('.webring-widget, .webring-widget-container');
              if (existingWidgets.length > 0) {
                existingWidgets.forEach(el => el.remove());
              }
              
              // Initialize the widget
              window.webring.init({
                type: "bar",
                color: "#73ff00",
                opacity: 0.95,
                position: "bottom",
                position_tab: "right",
                widget_content: "This webring is an incomplete directory—it's missing YOUR site!",
                slide_toggle: true
              });
              
              // Mark as initialized
              window.__webringInitialized = true;
            }
          }
          
          // Try immediately
          initWidget();
          
          // Try again after a short delay
          setTimeout(initWidget, 500);
          
          // Ensure it runs after DOM is fully loaded
          document.addEventListener('DOMContentLoaded', initWidget);
          
          // Final attempt after window load
          window.addEventListener('load', initWidget);
        `}
      </Script>

      </body>
    </html>
  )
}

