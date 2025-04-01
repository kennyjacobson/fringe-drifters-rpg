import path from 'path';
import fs from 'fs';
import { DrifterMetadata, DrifterAttribute, DrifterDatabase } from '../src/types';

const INPUT_FILE = path.join(__dirname, '../../../data/metadata/raw/all_metadata.json');
const OUTPUT_FILE = path.join(__dirname, '../src/data/generated/drifters.ts');

interface RawDrifter {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

async function generateDriftersDatabase() {
  try {
    const driftersDb: DrifterDatabase = {};
    const rawData = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
    
    if (!Array.isArray(rawData)) {
      throw new Error('Input data is not an array');
    }

    const data = rawData as RawDrifter[];

    data.forEach((drifter: RawDrifter) => {
      const drifterMetadata: DrifterMetadata = {
        name: drifter.name,
        description: drifter.description,
        image: drifter.image,
        attributes: drifter.attributes.map((attr: DrifterAttribute) => ({
          trait_type: attr.trait_type,
          value: attr.value
        }))
      };

      const drifterNumber = parseInt(drifter.name.split('#')[1], 10);
      driftersDb[drifterNumber] = drifterMetadata;
    });

    const fileContent = `
// Auto-generated from JSON metadata
// Do not edit directly

import { DrifterDatabase } from '../../types';

export const driftersDatabase: DrifterDatabase = ${JSON.stringify(driftersDb, null, 2)};
`;

    fs.writeFileSync(OUTPUT_FILE, fileContent);

  } catch (error) {
    console.error('Error generating drifters database:', error);
    process.exit(1);
  }
}

generateDriftersDatabase().catch(console.error);
