"use client"

import type React from "react"

import { useState } from "react"
import { Github } from "lucide-react"
import { useCategories, useRinglets } from "@/hooks/use-filters"

export default function JoinForm() {
  const { categories } = useCategories()
  const { ringlets } = useRinglets()
  const [formData, setFormData] = useState({
    url: "",
    name: "",
    description: "",
    owner: "",
    owner_type: "",
    color: "#888888",
    website_categories: [] as string[],
    ringlets: [] as string[],
  })

  // Update the handleInputChange function to handle the new form structure
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Skip special handling for the array fields as they're now handled by their own onChange handlers
    if (name === "website_categories" || name === "ringlets") return

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Ensure URL has proper format with protocol
    let formattedUrl = formData.url
    if (formattedUrl && !formattedUrl.match(/^https?:\/\//)) {
      formattedUrl = `https://${formattedUrl}`
    }

    // Convert form data to YAML format with all values quoted
    const yamlContent = `url: "${formattedUrl}"
name: "${formData.name}"
${formData.description ? `description: "${formData.description}"` : ''}
owner: "${formData.owner}"
owner_type: "${formData.owner_type}"
color: "${formData.color}"
website_categories:
${formData.website_categories.map((cat) => `  - "${cat}"`).join("\n")}
ringlets:
${formData.ringlets.map((ring) => `  - "${ring}"`).join("\n")}
`

    // Encode YAML content for URL
    const encodedYaml = encodeURIComponent(yamlContent)
    const filename = formData.name.toLowerCase().replace(/[^a-z0-9]/g, "-")

    // Redirect to GitHub PR creation with correct repo
    const githubUrl = `https://github.com/mocha/webring/new/main/directory?filename=${filename}.yaml&value=${encodedYaml}&message=Add ${formData.name} to webring&description=Adding my website to the webring directory.`

    window.open(githubUrl, "_blank")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="url" className="block text-lg font-medium">
            Site URL <span className="text-red-500">*</span>
          </label>
          <input
            id="url"
            name="url"
            type="text"
            required
            placeholder="example.com"
            className="w-full px-3 py-2 border rounded-md border-input bg-background"
            value={formData.url}
            onChange={handleInputChange}
          />
          <p className="text-xs text-muted-foreground">Where can we find your website?</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="name" className="block text-lg font-medium">
            Site Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="My Awesome Website"
            className="w-full px-3 py-2 border rounded-md border-input bg-background"
            value={formData.name}
            onChange={handleInputChange}
          />
          <p className="text-xs text-muted-foreground">What should we call it?</p>
        </div>

        <div className="space-y-2 col-span-1 md:col-span-2">
          <label htmlFor="description" className="block text-lg font-medium">
            Site Description
          </label>

          <textarea
            id="description"
            name="description"
            placeholder="A brief description of your website"
            className="w-full px-3 py-2 border rounded-md border-input bg-background min-h-[80px]"
            value={formData.description}
            onChange={handleInputChange}
          />
          <p className="text-xs text-muted-foreground">Optional. Describe your website in a few sentences and we'll show it on the card in the directory.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="owner" className="block text-lg font-medium">
            Owner <span className="text-red-500">*</span>
          </label>
          <input
            id="owner"
            name="owner"
            type="text"
            required
            placeholder="@username, email, or other identifier"
            className="w-full px-3 py-2 border rounded-md border-input bg-background"
            value={formData.owner}
            onChange={handleInputChange}
          />
          <p className="text-xs text-muted-foreground">Who are you / what's your handle?</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="owner_type" className="block text-lg font-medium">
            Owner Datatype
          </label>
          <input
            id="owner_type"
            name="owner_type"
            type="text"
            placeholder="Email, Bluesky, Twitter, etc."
            className="w-full px-3 py-2 border rounded-md border-input bg-background"
            value={formData.owner_type}
            onChange={handleInputChange}
          />
          <p className="text-xs text-muted-foreground">What did you put in the owner field? Email? Bluesky? Threads? IRC? If it's something we support, we'll turn it in to a link.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="color" className="block text-lg font-medium">
            Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              id="color"
              name="color"
              type="color"
              className="h-10 w-10 border rounded-md border-input bg-background"
              value={formData.color}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="color"
              className="flex-1 px-3 py-2 border rounded-md border-input bg-background"
              value={formData.color}
              onChange={handleInputChange}
              pattern="^#[0-9A-Fa-f]{6}$"
              placeholder="#RRGGBB"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="website_categories" className="block text-lg font-medium">
            Categories
          </label>
        <input
          id="website_categories"
          name="website_categories"
          type="text"
          placeholder="personal, blog, technology, art"
          className="w-full px-3 py-2 border rounded-md border-input bg-background"
          value={
            typeof formData.website_categories === "string"
              ? formData.website_categories
              : formData.website_categories.join(", ")
          }
          onChange={(e) => {
            const categoriesText = e.target.value
            setFormData((prev) => ({
              ...prev,
              website_categories: categoriesText.trim() ? categoriesText.split(",").map((cat) => cat.trim()) : [],
            }))
          }}
        />
        <p className="text-xs text-muted-foreground">Enter multiple categories separated by commas. You can put anything in, and as many entries as you'd like.</p>
        
        {categories && categories.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground mb-1">Existing categories:</p>
            <div className="flex flex-wrap gap-1">
              {categories.map((category, i) => (
                <span 
                  key={i}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted cursor-pointer hover:bg-muted/80"
                  onClick={() => {
                    const updatedCategories = [...formData.website_categories]
                    if (!updatedCategories.includes(category)) {
                      updatedCategories.push(category)
                    }
                    setFormData(prev => ({ ...prev, website_categories: updatedCategories }))
                  }}
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="ringlets" className="block text-lg font-medium">
            Ringlets
          </label>
        <input
          id="ringlets"
          name="ringlets"
          type="text"
          placeholder="personal-sites, dev-blogs, creative-portfolios"
          className="w-full px-3 py-2 border rounded-md border-input bg-background"
          value={typeof formData.ringlets === "string" ? formData.ringlets : formData.ringlets.join(", ")}
          onChange={(e) => {
            const ringletsText = e.target.value
            setFormData((prev) => ({
              ...prev,
              ringlets: ringletsText.trim() ? ringletsText.split(",").map((ring) => ring.trim()) : [],
            }))
          }}
        />
        <p className="text-xs text-muted-foreground">Enter multiple ringlet IDs separated by commas. <a href="https://github.com/mocha/webring/" target="_blank" rel="noopener noreferrer">More info here</a>.</p>

        {ringlets && ringlets.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground mb-1">Existing ringlets:</p>
            <div className="flex flex-wrap gap-1">
              {ringlets.map((ringlet, i) => (
                <span 
                  key={i}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted cursor-pointer hover:bg-muted/80"
                  onClick={() => {
                    const updatedRinglets = [...formData.ringlets]
                    if (!updatedRinglets.includes(ringlet.id)) {
                      updatedRinglets.push(ringlet.id)
                    }
                    setFormData(prev => ({ ...prev, ringlets: updatedRinglets }))
                  }}
                >
                  {ringlet.name} ({ringlet.id})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
        >
          <Github size={20} className="mr-2" />
          Submit to GitHub
        </button>
      </div>

    </form>
  )
}

