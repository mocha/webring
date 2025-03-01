#!/usr/bin/env node

/**
 * This script reads the full-ring.json file and generates individual JSON files
 * for each ringlet. These files are used by the webring widget to navigate
 * through ringlet-specific site collections.
 */

const fs = require('fs');
const path = require('path');

// Paths - adjusted for being inside application/utils
const fullRingPath = path.join(__dirname, '../public/data/full-ring.json');
const dataDir = path.join(__dirname, '../public/data');

// Ensure the data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log(`Created data directory at ${dataDir}`);
}

// Check if full-ring.json exists
if (!fs.existsSync(fullRingPath)) {
  console.log('Warning: full-ring.json does not exist yet. Skipping ringlet generation.');
  // Create an empty full-ring.json file if it doesn't exist
  const emptyData = { ringlets: {}, websites: {} };
  fs.writeFileSync(fullRingPath, JSON.stringify(emptyData, null, 2));
  console.log(`Created empty full-ring.json file at ${fullRingPath}`);
  process.exit(0);
}

// Read the full-ring.json file
console.log('Reading full-ring.json...');
try {
  const fullRingData = JSON.parse(fs.readFileSync(fullRingPath, 'utf8'));

  // Process ringlets
  if (fullRingData.ringlets) {
    console.log(`Found ${Object.keys(fullRingData.ringlets).length} ringlets`);
    
    // For each ringlet, create a JSON file with only the websites in that ringlet
    Object.keys(fullRingData.ringlets).forEach(ringletId => {
      const ringlet = fullRingData.ringlets[ringletId];
      console.log(`Processing ringlet: ${ringlet.name} (${ringletId})`);
      
      // Create a new structure that includes both ringlet metadata and websites
      const ringletData = {
        // Include ringlet metadata
        id: ringletId,
        name: ringlet.name,
        description: ringlet.description || '',
        url: ringlet.url || '',
        // Include websites in a nested object
        websites: {}
      };
      
      // Filter websites to only those in this ringlet
      Object.entries(fullRingData.websites || {}).forEach(([url, site]) => {
        if (site.ringlets && site.ringlets.includes(ringletId)) {
          ringletData.websites[url] = site;
        }
      });
      
      // Create the ringlet data file
      const ringletFilePath = path.join(dataDir, `${ringletId}.json`);
      fs.writeFileSync(ringletFilePath, JSON.stringify(ringletData, null, 2));
      console.log(`Created ${ringletId}.json with ringlet metadata and ${Object.keys(ringletData.websites).length} websites`);
    });
  } else {
    console.log('No ringlets found in full-ring.json');
  }
  
  console.log('Done generating ringlet files!');
} catch (error) {
  console.error('Error processing full-ring.json:', error);
  process.exit(1);
} 