import Link from "next/link"
import DirectoryTable from "@/components/directory-table"
import FilterInitializer from "@/components/filter-initializer"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <FilterInitializer />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Webring Directory</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover and explore personal websites from around the web, connected through a modern take on the classic
            webring.
          </p>
        </section>

        <DirectoryTable />

        <div className="mt-12 text-center border-t border-border pt-8">
          <h2 className="text-2xl font-bold mb-4">Join the Webring</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Add your personal website to our directory and become part of the community.
          </p>
          <Link
            href="/join"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-lg font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          >
            Get Added
          </Link>
        </div>
      </main>
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} Webring Directory</p>
        </div>
      </footer>
    </div>
  )
}

