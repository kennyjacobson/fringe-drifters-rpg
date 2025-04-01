import { parseEquipmentMarkdown } from '../src/utils/markdownParser';
import path from 'path';
import fs from 'fs';

const DOCS_DIR = path.join(__dirname, '../docs/equipment');
const OUTPUT_FILE = path.join(__dirname, '../src/data/generated/equipment.ts');

async function generateEquipmentDatabase() {
  try {

    
    // Use our main parser function that handles all equipment types
    const equipment = parseEquipmentMarkdown(DOCS_DIR);
    
    // Generate TypeScript file
    const fileContent = `
// Auto-generated from markdown documentation
// Do not edit directly

export const equipmentDatabase = ${JSON.stringify(equipment, null, 2)} as const;
`;

    fs.writeFileSync(OUTPUT_FILE, fileContent);
    console.log(`Generated equipment database at ${OUTPUT_FILE}`);
    
    // Log some stats about what was generated
    console.log('\nGenerated:');
    console.log(`- ${Object.keys(equipment.suits).length} suits`);
    console.log(`- ${Object.keys(equipment.accessories).length} accessories`);
    console.log(`- ${Object.keys(equipment.backpacks).length} backpacks`);
    console.log(`- ${Object.keys(equipment.graphics).length} graphics`);
    console.log(`- ${Object.keys(equipment.headgear).length} headgear`);

  } catch (error) {
    console.error('Error generating equipment database:', error);
    process.exit(1);
  }
}

generateEquipmentDatabase().catch(console.error);