import { type NextRequest, NextResponse } from "next/server"
import { getSites, getRinglets } from "@/lib/data"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")
  const ringletId = request.nextUrl.searchParams.get("ringlet")

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 })
  }

  try {
    const sites = await getSites()
    const filteredSites = ringletId ? sites.filter((site) => site.ringlets?.includes(ringletId)) : sites

    // Find the current site
    const currentSiteIndex = filteredSites.findIndex((site) => site.url === url || url.startsWith(site.url))

    if (currentSiteIndex === -1) {
      return NextResponse.json({ error: "Website not found in directory" }, { status: 404 })
    }

    // Get next and previous sites
    const nextSiteIndex = (currentSiteIndex + 1) % filteredSites.length
    const prevSiteIndex = (currentSiteIndex - 1 + filteredSites.length) % filteredSites.length

    // Get random site (different from current)
    let randomSiteIndex
    do {
      randomSiteIndex = Math.floor(Math.random() * filteredSites.length)
    } while (randomSiteIndex === currentSiteIndex && filteredSites.length > 1)

    // Get ringlet name if specified
    let ringletName = ""
    if (ringletId) {
      const ringlets = await getRinglets()
      const ringlet = ringlets.find((r) => r.id === ringletId)
      ringletName = ringlet?.name || ""
    }

    return NextResponse.json({
      link_next_name: filteredSites[nextSiteIndex].name,
      link_next_url: filteredSites[nextSiteIndex].url,
      link_prev_name: filteredSites[prevSiteIndex].name,
      link_prev_url: filteredSites[prevSiteIndex].url,
      random_link_name: filteredSites[randomSiteIndex].name,
      random_link_url: filteredSites[randomSiteIndex].url,
      ringlet_name: ringletName || "Webring",
    })
  } catch (error) {
    console.error("Error fetching widget data:", error)
    return NextResponse.json({ error: "Failed to fetch widget data" }, { status: 500 })
  }
}

