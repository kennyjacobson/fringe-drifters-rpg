import { parseEquipmentMarkdown } from '../src/utils/markdownParser';
import path from 'path';
import fs from 'fs';

const DOCS_DIR = path.join(__dirname, '../docs/equipment');
const OUTPUT_FILE = path.join(__dirname, '../src/data/generated/equipment.ts');

async function generateEquipmentDatabase() {
  // Parse each equipment type
  const suits = parseEquipmentMarkdown(path.join(DOCS_DIR, 'suits.md'));
  
  const database = {
    suits: Object.fromEntries(
      suits.map(suit => [
        suit.name,
        {
          type: suit.type,
          armorClass: suit.armorClass,
          properties: suit.properties,
          environmentalProtection: suit.environmentalProtection,
          abilityModifiers: suit.abilityModifiers,
          special: suit.special,
          industrialUse: suit.industrialUse,
          description: suit.description
        }
      ])
    ),
    // Add other equipment types
  };

  // Generate TypeScript file
  const fileContent = `
// Auto-generated from markdown documentation
// Do not edit directly

export const equipmentDatabase = ${JSON.stringify(database, null, 2)} as const;
`;

  fs.writeFileSync(OUTPUT_FILE, fileContent);
  console.log(`Generated equipment database at ${OUTPUT_FILE}`);
}

generateEquipmentDatabase().catch(console.error);