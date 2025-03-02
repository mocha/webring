"use client"

import { X, ExternalLink, Mail, Github, Gitlab, Instagram, AtSign } from "lucide-react"
import type { Site } from "@/types"
import { useFilterStore } from "@/stores/filters"
import { useState } from "react"
import { getTextColorForBackground } from "@/utils/color"

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

interface SiteDetailModalProps {
  site: Site
  onClose: () => void
}

export default function SiteDetailModal({ site, onClose }: SiteDetailModalProps) {
  const { setCategory, setRinglet } = useFilterStore()
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  
  // Get the appropriate text color for the site's color
  const siteColor = site.color || "#888888"
  const textColor = getTextColorForBackground(siteColor)
  const buttonTextColor = textColor === "black" ? "text-black" : "text-white"

  const handleCategoryClick = (category: string) => {
    // Clear the ringlet filter and set the selected category
    setRinglet(null)
    setCategory(category)
    
    // Update URL with the category parameter
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams()
      params.set('category', category)
      
      // Construct the new URL and navigate to it
      const newUrl = `${window.location.pathname}?${params.toString()}`
      window.history.replaceState({}, '', newUrl)
    }
    
    onClose()
  }
  
  const handleRingletClick = (ringlet: string) => {
    // Clear the category filter and set the selected ringlet
    setCategory(null)
    setRinglet(ringlet)
    
    // Update URL with the ringlet parameter
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams()
      params.set('ringlet', ringlet)
      
      // Construct the new URL and navigate to it
      const newUrl = `${window.location.pathname}?${params.toString()}`
      window.history.replaceState({}, '', newUrl)
    }
    
    onClose()
  }

  // Function to get the appropriate link and icon based on owner_type
  const getOwnerLink = () => {
    if (!site.owner_type) return null;
    
    const ownerValue = site.owner;
    let url = "";
    let icon = <ExternalLink size={16} className="mr-2 flex-shrink-0" />;
    
    switch(site.owner_type.toLowerCase()) {
      case 'email':
        url = `mailto:${ownerValue}`;
        icon = (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 448 512"
            width="16"
            height="16"
            className="mr-2 flex-shrink-0 fill-current"
          >
            {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. */}
            <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/>
          </svg>
        );
        break;
      case 'bluesky':
        // Bluesky handles may or may not include the @ prefix
        const blueskyHandle = ownerValue.startsWith('@') ? ownerValue.substring(1) : ownerValue;
        url = `https://bsky.app/profile/${blueskyHandle}.bsky.social`;
        icon = (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 448 512"
            width="16"
            height="16"
            className="mr-2 flex-shrink-0 fill-current"
          >
            {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. */}
            <path d="M111.8 62.2C170.2 105.9 233 194.7 256 242.4c23-47.6 85.8-136.4 144.2-180.2c42.1-31.6 110.3-56 110.3 21.8c0 15.5-8.9 130.5-14.1 149.2C478.2 298 412 314.6 353.1 304.5c102.9 17.5 129.1 75.5 72.5 133.5c-107.4 110.2-154.3-27.6-166.3-62.9l0 0c-1.7-4.9-2.6-7.8-3.3-7.8s-1.6 3-3.3 7.8l0 0c-12 35.3-59 173.1-166.3 62.9c-56.5-58-30.4-116 72.5-133.5C100 314.6 33.8 298 15.7 233.1C10.4 214.4 1.5 99.4 1.5 83.9c0-77.8 68.2-53.4 110.3-21.8z"/>
          </svg>
        );
        break;
      case 'twitter':
      case 'x':
        const twitterHandle = ownerValue.startsWith('@') ? ownerValue.substring(1) : ownerValue;
        url = `https://twitter.com/${twitterHandle}`;
        icon = (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 448 512"
            width="16"
            height="16"
            className="mr-2 flex-shrink-0 fill-current"
          >
            {/* Font Awesome X/Twitter icon */}
            <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/>
          </svg>
        );
        break;
      case 'threads':
        const threadsHandle = ownerValue.startsWith('@') ? ownerValue.substring(1) : ownerValue;
        url = `https://threads.net/@${threadsHandle}`;
        icon = (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 448 512"
            width="16"
            height="16"
            className="mr-2 flex-shrink-0 fill-current"
          >
            {/* Font Awesome Threads icon */}
            <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm297.1 84L257.3 234.6c-11.4 11.4-26.9 17.7-43.1 17.7s-31.7-6.3-43.1-17.7L67.1 116c-6-6-9.4-14.1-9.4-22.6c0-17.7 14.3-32 32-32s32 14.3 32 32c0 8.5-3.4 16.6-9.4 22.6l68.3 68.3c4.6 4.6 10.8 7.2 17.4 7.2s12.8-2.6 17.4-7.2l68.3-68.3c-6-6-9.4-14.1-9.4-22.6c0-17.7 14.3-32 32-32s32 14.3 32 32c0 8.5-3.4 16.6-9.4 22.6zM257.3 267.1l104 104c6 6 9.4 14.1 9.4 22.6c0 17.7-14.3 32-32 32s-32-14.3-32-32c0-8.5 3.4-16.6 9.4-22.6L316 371c-59.2 59.2-155.2 59.2-214.4 0l-.3-.3c-6-6-9.4-14.1-9.4-22.6c0-17.7 14.3-32 32-32s32 14.3 32 32c0 8.5-3.4 16.6-9.4 22.6l.3 .3c37.2 37.2 97.5 37.2 134.8 0l.3-.3c-6-6-9.4-14.1-9.4-22.6c0-17.7 14.3-32 32-32s32 14.3 32 32c0 8.5-3.4 16.6-9.4 22.6l-.3 .3z"/>
          </svg>
        );
        break;
      case 'github':
        const githubHandle = ownerValue.startsWith('@') ? ownerValue.substring(1) : ownerValue;
        url = `https://github.com/${githubHandle}`;
        icon = <Github size={16} className="mr-2 flex-shrink-0" />;
        break;
      case 'gitlab':
        const gitlabHandle = ownerValue.startsWith('@') ? ownerValue.substring(1) : ownerValue;
        url = `https://gitlab.com/${gitlabHandle}`;
        icon = <Gitlab size={16} className="mr-2 flex-shrink-0" />;
        break;
      case 'reddit':
        const redditHandle = ownerValue.startsWith('/u/') 
          ? ownerValue.substring(3) 
          : ownerValue.startsWith('u/') 
            ? ownerValue.substring(2) 
            : ownerValue;
        url = `https://reddit.com/user/${redditHandle}`;
        // Using a proper JSX SVG for Reddit
        icon = (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 512 512" 
            width="16" 
            height="16" 
            className="mr-2 flex-shrink-0 fill-current"
          >
            {/* Font Awesome Reddit Icon */}
            <path d="M0 256C0 114.6 114.6 0 256 0S512 114.6 512 256s-114.6 256-256 256L37.1 512c-13.7 0-20.5-16.5-10.9-26.2L75 437C28.7 390.7 0 326.7 0 256zM349.6 153.6c23.6 0 42.7-19.1 42.7-42.7s-19.1-42.7-42.7-42.7c-20.6 0-37.8 14.6-41.8 34c-34.5 3.7-61.4 33-61.4 68.4l0 .2c-37.5 1.6-71.8 12.3-99 29.1c-10.1-7.8-22.8-12.5-36.5-12.5c-33 0-59.8 26.8-59.8 59.8c0 24 14.1 44.6 34.4 54.1c2 69.4 77.6 125.2 170.6 125.2s168.7-55.9 170.6-125.3c20.2-9.6 34.1-30.2 34.1-54c0-33-26.8-59.8-59.8-59.8c-13.7 0-26.3 4.6-36.4 12.4c-27.4-17-62.1-27.7-100-29.1l0-.2c0-25.4 18.9-46.5 43.4-49.9l0 0c4.4 18.8 21.3 32.8 41.5 32.8zM177.1 246.9c16.7 0 29.5 17.6 28.5 39.3s-13.5 29.6-30.3 29.6s-31.4-8.8-30.4-30.5s15.4-38.3 32.1-38.3zm190.1 38.3c1 21.7-13.7 30.5-30.4 30.5s-29.3-7.9-30.3-29.6c-1-21.7 11.8-39.3 28.5-39.3s31.2 16.6 32.1 38.3zm-48.1 56.7c-10.3 24.6-34.6 41.9-63 41.9s-52.7-17.3-63-41.9c-1.2-2.9 .8-6.2 3.9-6.5c18.4-1.9 38.3-2.9 59.1-2.9s40.7 1 59.1 2.9c3.1 .3 5.1 3.6 3.9 6.5z" />
          </svg>
        );
        break;
      case 'mastodon':
        // Mastodon handles often include the server, like @user@server.social
        let mastodonHandle = ownerValue;
        if (mastodonHandle.startsWith('@') && !mastodonHandle.includes('@', 1)) {
          // Just a handle without server - can't create proper URL without server info
          return null;
        }
        
        // If it's a full handle with server (@user@server.social)
        if (mastodonHandle.startsWith('@') && mastodonHandle.includes('@', 1)) {
          const parts = mastodonHandle.substring(1).split('@');
          if (parts.length === 2) {
            url = `https://${parts[1]}/@${parts[0]}`;
          }
        } else if (mastodonHandle.includes('@')) {
          // Handle without leading @ (user@server.social)
          const parts = mastodonHandle.split('@');
          if (parts.length === 2) {
            url = `https://${parts[1]}/@${parts[0]}`;
          }
        }
        
        if (!url) return null; // Skip if we couldn't parse properly
        icon = <AtSign size={16} className="mr-2 flex-shrink-0" />;
        break;
      default:
        return null;
    }
    
    return { url, icon };
  };

  const ownerLink = getOwnerLink();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8" onClick={onClose}>
      <div
        className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          borderLeft: `8px solid ${site.color || "#888888"}`,
        }}
      >
        <div className="flex justify-between items-center p-8 border-b border-border">
          <h2 className="text-6xl font-bold">{site.name}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-muted">
            <X size={24} />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="p-8">
          {site.description && (
            <div className="mb-6">
              <p className="text-lg text-muted-foreground">{site.description}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Website</h3>
              <p className="mb-4">
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center"
                >
                  <ExternalLink size={16} className="mr-2 flex-shrink-0" />
                  {site.url}
                </a>
              </p>

              <h3 className="text-sm font-medium text-muted-foreground mb-1">Owner</h3>
              <p className="mb-4">
                {ownerLink ? (
                  <a
                    href={ownerLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center"
                  >
                    {ownerLink.icon}
                    {site.owner}
                  </a>
                ) : (
                  <>
                    {site.owner}
                    {site.owner_type && <span className="text-sm text-muted-foreground ml-1">({site.owner_type})</span>}
                  </>
                )}
              </p>
            </div>

            <div>
              {site.website_categories && site.website_categories.length > 0 && (
                <>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {site.website_categories.map((category, i) => (
                      <button
                        key={i}
                        onClick={() => handleCategoryClick(category)}
                        className="bg-muted hover:bg-muted/80 rounded-full px-3 py-1 text-sm cursor-pointer transition-colors"
                      >
                        {formatDisplayName(category)}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {site.ringlets && site.ringlets.length > 0 && (
                <>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Ringlets</h3>
                  <div className="flex flex-wrap gap-1">
                    {site.ringlets.map((ringlet, i) => (
                      <button
                        key={i}
                        onClick={() => handleRingletClick(ringlet)}
                        className="bg-muted hover:bg-muted/80 rounded-full px-3 py-1 text-sm cursor-pointer transition-colors"
                      >
                        {formatDisplayName(ringlet)}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-lg font-medium text-primary-foreground shadow transition-colors"
              style={{
                ...(isButtonHovered && {
                  backgroundColor: siteColor,
                  color: textColor === "black" ? "black" : "white"
                })
              }}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
            >
              {site.url}
              <ExternalLink size={18} className="ml-2" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

