import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import Link from "next/link"
import { Home, Plus, DoorOpen } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Webring Directory",
  description: "A modern webring connecting personal websites across the internet",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b border-border fixed top-0 left-0 right-0 w-full bg-background z-50">
          <div className="container mx-auto px-4 py-4 flex flex-row items-center justify-between gap-4">
            <Link href="/" className="text-xl font-bold flex items-center">
              <Home size={20} className="mr-2" />
              Webring!
            </Link>
            <nav>
              <ul className="flex items-center gap-6">
                <li>
                  <Link 
                    href="/join" 
                    className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    <DoorOpen size={18} className="mr-1" />
                    <span>Join</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <div className="pt-16">{children}</div>
      </body>
    </html>
  )
}

