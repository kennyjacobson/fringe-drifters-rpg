const fs = require('fs');
const path = require('path');

// Load the collected metadata
const RAW_DIR = path.join(process.cwd(), 'data/metadata/raw');
const OUTPUT_DIR = path.join(process.cwd(), 'data/metadata/processed');

// Load the metadata
const metadata = require(path.join(RAW_DIR, 'all_metadata.json'));

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Function to analyze trait distributions
function analyzeTraits() {
  const traitStats = {};
  const totalCount = metadata.length;
  
  // Initialize trait statistics
  metadata.forEach(nft => {
    if (!nft.attributes) return;
    
    nft.attributes.forEach(trait => {
      if (!traitStats[trait.trait_type]) {
        traitStats[trait.trait_type] = {
          values: {},
          count: 0
        };
      }
      
      if (!traitStats[trait.trait_type].values[trait.value]) {
        traitStats[trait.trait_type].values[trait.value] = 0;
      }
      
      traitStats[trait.trait_type].values[trait.value]++;
      traitStats[trait.trait_type].count++;
    });
  });
  
  // Calculate percentages and rarity scores
  Object.keys(traitStats).forEach(traitType => {
    const trait = traitStats[traitType];
    const values = trait.values;
    
    // Sort values by frequency (descending)
    const sortedValues = Object.entries(values)
      .map(([value, count]) => ({
        value,
        count,
        percentage: (count / totalCount * 100).toFixed(2),
        rarity: (totalCount / count).toFixed(2)
      }))
      .sort((a, b) => b.count - a.count);
    
    trait.sortedValues = sortedValues;
  });
  
  // Save the analysis
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'trait_statistics.json'),
    JSON.stringify(traitStats, null, 2)
  );
  
  return traitStats;
}

// Function to find trait correlations
function findCorrelations() {
  // This is a simplified correlation analysis
  // For each pair of traits, count how often they appear together
  const correlations = {};
  
  metadata.forEach(nft => {
    if (!nft.attributes || nft.attributes.length < 2) return;
    
    // For each pair of traits in this NFT
    for (let i = 0; i < nft.attributes.length; i++) {
      for (let j = i + 1; j < nft.attributes.length; j++) {
        const traitA = nft.attributes[i];
        const traitB = nft.attributes[j];
        
        const key = `${traitA.trait_type}:${traitA.value}|${traitB.trait_type}:${traitB.value}`;
        
        if (!correlations[key]) {
          correlations[key] = 0;
        }
        
        correlations[key]++;
      }
    }
  });
  
  // Filter to only significant correlations (appearing more than once)
  const significantCorrelations = Object.entries(correlations)
    .filter(([_, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .reduce((acc, [key, count]) => {
      acc[key] = count;
      return acc;
    }, {});
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'trait_correlations.json'),
    JSON.stringify(significantCorrelations, null, 2)
  );
  
  return significantCorrelations;
}

// Run the analysis
console.log('Starting trait analysis...');
const traitStats = analyzeTraits();
console.log('Trait statistics generated.');

console.log('Finding trait correlations...');
const correlations = findCorrelations();
console.log('Correlation analysis complete.');

// Generate a summary report
const summary = {
  totalNFTs: metadata.length,
  traitTypes: Object.keys(traitStats).length,
  traitSummary: Object.entries(traitStats).map(([type, data]) => ({
    type,
    uniqueValues: Object.keys(data.values).length,
    mostCommon: data.sortedValues[0]
  }))
};

fs.writeFileSync(
  path.join(OUTPUT_DIR, 'analysis_summary.json'),
  JSON.stringify(summary, null, 2)
);

console.log('Analysis complete!');