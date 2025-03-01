export interface Site {
  url: string
  name: string
  owner: string
  owner_type?: string
  color?: string
  description?: string
  website_categories?: string[]
  ringlets?: string[]
}

export interface Ringlet {
  id: string
  name: string
  description?: string
  link?: string
}

