const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Determine if we're running in GitHub Actions by checking for the GITHUB_ACTIONS environment variable
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

// Set paths based on where the script is running
const DIRECTORY_PATH = path.join(__dirname, '../../directory');
const RINGLETS_PATH = path.join(__dirname, '../../ringlets');
const OUTPUT_DIR = path.join(__dirname, '../public/data');
const RINGLET_OUTPUT_DIR = path.join(__dirname, '../public/data');

// Ensure output directories exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Created output directory: ${OUTPUT_DIR}`);
}

/**
 * Ensure URL has a protocol prefix. If not, prepend https://
 * @param {string} url - URL to check and fix
 * @returns {string} - URL with protocol
 */
function ensureUrlProtocol(url) {
  if (!url) return url;
  return url.match(/^https?:\/\//) ? url : `https://${url}`;
}

/**
 * Recursively read all YAML files from a directory
 * @param {string} dir - Directory to read from
 * @returns {Array<Object>} - Array of file contents and metadata
 */
function readYamlFilesRecursively(dir) {
  if (!fs.existsSync(dir)) {
    console.warn(`Directory does not exist: ${dir}`);
    return [];
  }

  const results = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      // Recursively read subdirectories
      results.push(...readYamlFilesRecursively(filePath));
    } else if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = yaml.load(content);
        
        // Add the filename (without extension) as metadata
        const filename = path.basename(file.name, path.extname(file.name));
        
        results.push({
          ...data,
          _filename: filename
        });
      } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
      }
    }
  }

  return results;
}

// Main execution
function main() {
  console.log('Starting data import process...');
  
  // 1. Read all ringlets
  console.log('Reading ringlets...');
  const ringletsList = readYamlFilesRecursively(RINGLETS_PATH);
  const ringlets = {};
  
  for (const ringlet of ringletsList) {
    const id = ringlet._filename;
    delete ringlet._filename;
    ringlets[id] = ringlet;
  }
  
  console.log(`Successfully read ${Object.keys(ringlets).length} ringlets`);
  
  // 2. Read all websites
  console.log('Reading websites...');
  const websitesList = readYamlFilesRecursively(DIRECTORY_PATH);
  const websites = {};
  
  for (const website of websitesList) {
    if (!website.url) {
      console.warn('Skipping website without URL:', website);
      continue;
    }
    
    // Ensure URL has protocol
    website.url = ensureUrlProtocol(website.url);
    
    // Use URL as the key for the websites dictionary
    const key = website.url;
    delete website._filename;
    websites[key] = website;
  }
  
  console.log(`Successfully read ${Object.keys(websites).length} websites`);
  
  // 3. Create all.json with both dictionaries
  const fullRingData = {
    ringlets,
    websites
  };
  
  const fullRingPath = path.join(OUTPUT_DIR, 'all.json');
  fs.writeFileSync(fullRingPath, JSON.stringify(fullRingData, null, 2));
  console.log(`Created full ring data at ${fullRingPath}`);
  
  console.log('Creating individual ringlet files...');
  
  for (const [ringletId, ringlet] of Object.entries(ringlets)) {
    // Filter websites that belong to this ringlet
    const ringletWebsites = {};
    
    for (const [url, website] of Object.entries(websites)) {
      if (website.ringlets && website.ringlets.includes(ringletId)) {
        ringletWebsites[url] = website;
      }
    }
    
    const ringletPath = path.join(RINGLET_OUTPUT_DIR, `${ringletId}.json`);
    fs.writeFileSync(ringletPath, JSON.stringify(ringletWebsites, null, 2));
  }
  
  console.log(`Created ${Object.keys(ringlets).length} individual ringlet files in ${RINGLET_OUTPUT_DIR}`);
  console.log('Data import process completed successfully!');
}

// Run the script
main(); 