"use client"

import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import DirectoryTable from "@/components/directory-table"
import { useFilterStore } from "@/stores/filters"
import { useRinglets } from "@/hooks/use-filters"
import { Suspense } from "react"

// Utility function to format category and ringlet names for display
const formatDisplayName = (name: string): string => {
  // Replace underscores and hyphens with spaces
  const withSpaces = name.replace(/[_-]/g, ' ');
  
  // Convert to sentence case (capitalize first letter of each word)
  return withSpaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Component that uses useSearchParams
function HomePage() {
  const { selectedCategory, selectedRinglet } = useFilterStore();
  const { ringlets } = useRinglets();
  
  // Find the selected ringlet details if one is selected
  const selectedRingletDetails = selectedRinglet 
    ? ringlets?.find(r => r.id === selectedRinglet) 
    : null;
    
  // Determine what to display in the header section based on filters
  let headerTitle = "We're doing a webring!";
  let headerSubtitle = (
    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
      Webrings are loose collections of <em>personal websites</em> that each link to the next (you know, making a circle-like object). This makes it easier to discover new individual websites, helping you connect with more people with interesting stuff to share.
    </p>
  );
  
  // If a ringlet is selected (with or without a category)
  if (selectedRinglet && selectedRingletDetails) {
    headerTitle = `The ${selectedRingletDetails.name || formatDisplayName(selectedRinglet)} webring`;
    
    if (selectedRingletDetails.description) {
      headerSubtitle = (
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {selectedRingletDetails.description}
        </p>
      );
    } else {
      // Empty fragment instead of null to satisfy TypeScript
      headerSubtitle = <></>;
    }
  }
  // If only a category is selected
  else if (selectedCategory) {
    const formattedCategory = formatDisplayName(selectedCategory);
    headerTitle = `Sites about ${formattedCategory}`;
    headerSubtitle = (
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        These are all of the sites across our webring that are listed under the{" "}
        <span className="bg-muted rounded-full px-3 py-1 text-foreground font-medium">
          {formattedCategory}
        </span>{" "}
        category.
      </p>
    );
  }

  return (
    <main className="container py-8 md:py-12">
      <section className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{headerTitle}</h1>
        {headerSubtitle}
        
        {/* Display ringlet URL if available */}
        {selectedRinglet && selectedRingletDetails?.url && (
          <a 
            href={selectedRingletDetails.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-4 text-primary hover:underline"
          >
            {selectedRingletDetails.url}
            <ExternalLink size={16} className="ml-2" />
          </a>
        )}
      </section>

      <DirectoryTable />

    </main>
  )
}

// Wrap the component with Suspense
export default function Home() {
  return (
    <Suspense fallback={
      <div className="container py-8 md:py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Loading...</h1>
      </div>
    }>
      <HomePage />
    </Suspense>
  )
}

