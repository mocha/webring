// Test script for color utilities
const { isColorLight, getTextColorForBackground } = require('./dist/utils/color');

// Test different colors including problematic ones
const colors = [
  '#ff0',      // Light yellow (shorthand)
  '#ffff00',   // Light yellow
  '#ffffff',   // White
  '#000000',   // Black
  '#f00',      // Red (shorthand)
  '#00f',      // Blue (shorthand)
  '#ffcc00',   // Gold
  '#e0e0e0',   // Light gray
  '#cccccc',   // Gray
  '#333333',   // Dark gray
];

console.log('Testing color detection:');
console.log('------------------------');
console.log('Color\t\tIs Light?\tText Color');
console.log('------------------------');

colors.forEach(color => {
  const isLight = isColorLight(color);
  const textColor = getTextColorForBackground(color);
  console.log(`${color}\t\t${isLight}\t\t${textColor}`);
}); 