#!/usr/bin/env node

/**
 * This script reads the full-ring.json file and generates individual JSON files
 * for each ringlet. These files are used by the webring widget to navigate
 * through ringlet-specific site collections.
 */

const fs = require('fs');
const path = require('path');

// Paths
const fullRingPath = path.join(__dirname, '../application/public/data/full-ring.json');
const dataDir = path.join(__dirname, '../application/public/data');

// Ensure the data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Read the full-ring.json file
console.log('Reading full-ring.json...');
const fullRingData = JSON.parse(fs.readFileSync(fullRingPath, 'utf8'));

// Process ringlets
if (fullRingData.ringlets) {
  console.log(`Found ${Object.keys(fullRingData.ringlets).length} ringlets`);
  
  // For each ringlet, create a JSON file with only the websites in that ringlet
  Object.keys(fullRingData.ringlets).forEach(ringletId => {
    const ringlet = fullRingData.ringlets[ringletId];
    console.log(`Processing ringlet: ${ringlet.name} (${ringletId})`);
    
    // Filter websites to only those in this ringlet
    const ringletWebsites = {};
    Object.entries(fullRingData.websites).forEach(([url, site]) => {
      if (site.ringlets && site.ringlets.includes(ringletId)) {
        ringletWebsites[url] = site;
      }
    });
    
    // Create the ringlet data file
    const ringletFilePath = path.join(dataDir, `${ringletId}.json`);
    fs.writeFileSync(ringletFilePath, JSON.stringify(ringletWebsites, null, 2));
    console.log(`Created ${ringletId}.json with ${Object.keys(ringletWebsites).length} websites`);
  });
} else {
  console.log('No ringlets found in full-ring.json');
}

console.log('Done generating ringlet files!'); 