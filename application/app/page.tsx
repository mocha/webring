import Link from "next/link"
import { Suspense } from "react"
import DirectoryTable from "@/components/directory-table"
import FilterInitializer from "@/components/filter-initializer"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={null}>
        <FilterInitializer />
      </Suspense>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">We're doing a webring!</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Webrings are loose collections of <em>personal websites</em> that each link to the next (you know, making a circle-like object). This makes it easier to discover new individual websites, helping you connect with more people with interesting stuff to share.
          </p>
        </section>

        <Suspense fallback={<div className="text-center py-12">Loading directory...</div>}>
          <DirectoryTable />
        </Suspense>

      </main>
    </div>
  )
}

