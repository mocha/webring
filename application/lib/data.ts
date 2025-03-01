import type { Site, Ringlet } from "@/types"

// Define the structure of the JSON data
interface RingData {
  ringlets: Record<string, Omit<Ringlet, "id">>
  websites: Record<string, Site>
}

// Function to fetch the full ring data from the JSON file
async function fetchRingData(): Promise<RingData> {
  try {
    // Fetch the data from the JSON file
    const response = await fetch('/data/full-ring.json', { 
      // Add cache: 'no-store' to avoid caching during development
      cache: process.env.NODE_ENV === 'development' ? 'no-store' : 'default'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching ring data:', error);
    
    // Fallback to empty data if fetch fails
    return { ringlets: {}, websites: {} };
  }
}

export async function getSites(): Promise<Site[]> {
  const data = await fetchRingData();
  
  // Convert the websites object to an array
  return Object.values(data.websites);
}

export async function getAllSites(): Promise<Site[]> {
  return getSites();
}

export async function getRinglets(): Promise<Ringlet[]> {
  const data = await fetchRingData();
  
  // Convert the ringlets object to an array with the id added from the key
  return Object.entries(data.ringlets).map(([id, ringlet]) => ({
    id,
    ...ringlet,
  }));
}

export async function getAllRinglets(): Promise<Ringlet[]> {
  return getRinglets();
}

export async function getAllCategories(): Promise<string[]> {
  const sites = await getSites();
  
  // Extract all categories from all sites and remove duplicates
  const categories = new Set<string>();
  
  sites.forEach(site => {
    if (site.website_categories) {
      site.website_categories.forEach(category => {
        categories.add(category);
      });
    }
  });
  
  return Array.from(categories).sort();
}

// Functions for retrieving sites by criteria
export async function getSitesByRinglet(ringletId: string): Promise<Site[]> {
  const sites = await getSites();
  return sites.filter(site => site.ringlets?.includes(ringletId));
}

export async function getSitesByCategory(category: string): Promise<Site[]> {
  const sites = await getSites();
  return sites.filter(site => site.website_categories?.includes(category));
}

export async function getSiteByUrl(url: string): Promise<Site | undefined> {
  const sites = await getSites();
  return sites.find(site => site.url === url);
}

