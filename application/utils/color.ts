export function isColorLight(color: string): boolean {
  // Remove the hash if it exists
  const hex = color.replace("#", "")

  // Handle shorthand hex colors (e.g., #ff0 -> #ffff00)
  const fullHex = hex.length === 3 
    ? hex.split('').map(c => c + c).join('')
    : hex

  // Convert hex to RGB
  const r = Number.parseInt(fullHex.substr(0, 2) || "00", 16)
  const g = Number.parseInt(fullHex.substr(2, 2) || "00", 16)
  const b = Number.parseInt(fullHex.substr(4, 2) || "00", 16)

  // Calculate perceived brightness using the formula: (R * 299 + G * 587 + B * 114) / 1000
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  // Calculate contrast ratio approximation
  // Higher threshold for better contrast with text
  return brightness > 175
}

// Function to determine if text should be black or white based on background color contrast
export function getTextColorForBackground(color: string): string {
  return isColorLight(color) ? "black" : "white"
}

// Helper function to darken a color for hover states
export function darkenColor(color: string, amount = 0.1): string {
  // Remove the hash if it exists
  const hex = color.replace("#", "")
  
  // Handle shorthand hex colors
  const fullHex = hex.length === 3 
    ? hex.split('').map(c => c + c).join('')
    : hex

  const r = Number.parseInt(fullHex.substr(0, 2) || "00", 16)
  const g = Number.parseInt(fullHex.substr(2, 2) || "00", 16)
  const b = Number.parseInt(fullHex.substr(4, 2) || "00", 16)

  const darkenChannel = (channel: number) => Math.max(0, Math.floor(channel * (1 - amount)))

  const dr = darkenChannel(r).toString(16).padStart(2, "0")
  const dg = darkenChannel(g).toString(16).padStart(2, "0")
  const db = darkenChannel(b).toString(16).padStart(2, "0")

  return `#${dr}${dg}${db}`
}

