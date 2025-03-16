const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuration
const BASE_URL = 'https://omniscient.fringedrifters.com/main/metadata/';
const OUTPUT_DIR = path.join(process.cwd(), 'data/metadata/raw');
const START_ID = 1;
const END_ID = 3407; // Adjust based on collection size
const BATCH_SIZE = 50; // Number of requests to make in parallel
const DELAY_MS = 100; // Delay between batches to avoid rate limiting

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Function to fetch metadata for a single NFT
async function fetchMetadata(id) {
  try {
    const response = await axios.get(`${BASE_URL}${id}.json`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching metadata for ID ${id}:`, error.message);
    return null;
  }
}

// Function to process metadata in batches
async function processBatch(startId, endId) {
  const ids = Array.from({ length: endId - startId + 1 }, (_, i) => startId + i);
  const results = await Promise.all(ids.map(fetchMetadata));
  
  // Filter out failed requests
  return results.filter(result => result !== null);
}

// Main function to fetch all metadata
async function fetchAllMetadata() {
  console.log(`Starting metadata collection from ID ${START_ID} to ${END_ID}`);
  
  const allMetadata = [];
  const traitMap = new Map(); // To store trait types and their possible values
  
  // Process in batches
  for (let i = START_ID; i <= END_ID; i += BATCH_SIZE) {
    const batchEnd = Math.min(i + BATCH_SIZE - 1, END_ID);
    console.log(`Processing batch: ${i} to ${batchEnd}`);
    
    const batchResults = await processBatch(i, batchEnd);
    allMetadata.push(...batchResults);
    
    // Update trait map
    for (const metadata of batchResults) {
      if (metadata.attributes) {
        for (const trait of metadata.attributes) {
          if (!traitMap.has(trait.trait_type)) {
            traitMap.set(trait.trait_type, new Set());
          }
          traitMap.get(trait.trait_type).add(trait.value);
        }
      }
    }
    
    // Add delay between batches
    if (i + BATCH_SIZE <= END_ID) {
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  }
  
  // Save all metadata
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'all_metadata.json'),
    JSON.stringify(allMetadata, null, 2)
  );
  
  // Convert trait map to a more readable format
  const traitAnalysis = {};
  for (const [traitType, values] of traitMap.entries()) {
    traitAnalysis[traitType] = Array.from(values);
  }
  
  // Save trait analysis
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'trait_analysis.json'),
    JSON.stringify(traitAnalysis, null, 2)
  );
  
  console.log(`Collection complete. Processed ${allMetadata.length} NFTs.`);
  console.log(`Found ${traitMap.size} unique trait types.`);
  
  // Print summary of each trait type
  for (const [traitType, values] of traitMap.entries()) {
    console.log(`- ${traitType}: ${values.size} unique values`);
  }
}

// Run the collection
fetchAllMetadata().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});