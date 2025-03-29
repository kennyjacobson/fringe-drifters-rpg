import fs from 'fs';
// import path from 'path';

interface EquipmentEntry {
  name: string;
  description: string;
  type: string;
  armorClass: string;
  properties: string[];
  environmentalProtection: Record<string, number>;
  abilityModifiers: Record<string, number>;
  special?: string;
  industrialUse: string;
}

export function parseEquipmentMarkdown(filePath: string): EquipmentEntry[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Skip implementation notes section
  const [_, suitsSection] = content.split('## Suits');
  if (!suitsSection) return [];
  
  // Split into individual suit entries
  const suitEntries = suitsSection.split('###').filter(Boolean);
  
  return suitEntries.map(entry => {
    const lines = entry.trim().split('\n');
    const name = lines[0].trim();
    
    const attributes: EquipmentEntry = {
      name,
      description: '',
      type: '',
      armorClass: '',
      properties: [],
      environmentalProtection: {},
      abilityModifiers: {},
      industrialUse: ''
    };
    
    let currentSection = '';
    let descriptionLines: string[] = [];
    
    lines.slice(1).forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('- ')) {
        const [key, value] = trimmedLine.slice(2).split(':').map(s => s?.trim() || '');
        
        switch (key) {
          case 'Type':
            attributes.type = value;
            break;
          case 'Armor Class':
            attributes.armorClass = value;
            break;
          case 'Properties':
            attributes.properties = value.split(', ').filter(Boolean);
            break;
          case 'Environmental Protection':
            currentSection = 'env';
            break;
          case 'Ability Modifier':
            if (value) {
              const [amount, ability] = value.split(' ');
              if (amount && ability) {
                attributes.abilityModifiers[ability] = parseInt(amount);
              }
            }
            break;
          case 'Special':
            attributes.special = value;
            break;
          case 'Industrial Use':
            attributes.industrialUse = value;
            break;
          default:
            if (currentSection === 'env' && value) {
              const [type, bonus] = value.split(':').map(s => s?.trim() || '');
              if (type && bonus) {
                attributes.environmentalProtection[type] = parseInt(bonus);
              }
            }
        }
      } else if (trimmedLine && !trimmedLine.startsWith('-')) {
        descriptionLines.push(trimmedLine);
      }
    });
    
    attributes.description = descriptionLines.join('\n').trim();
    
    return attributes;
  });
}

// function extractAttributes(description: string): EquipmentEntry['attributes'] {
//   const attributes: EquipmentEntry['attributes'] = {
//     properties: []
//   };

//   // Example attribute extraction rules
//   if (description.toLowerCase().includes('ac bonus')) {
//     // Extract AC bonus using regex
//     const acMatch = description.match(/\+(\d+)\s+AC/);
//     if (acMatch) {
//       attributes.acBonus = parseInt(acMatch[1]);
//     }
//   }

//   // Add more attribute extraction logic based on text analysis
  
//   return attributes;
// }