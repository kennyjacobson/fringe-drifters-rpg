import fs from 'fs';
// import path from 'path';
import { 
  Suit, 
  Accessory, 
  Backpack, 
  Graphic, 
  Headgear,
  DamageType,
  DiceRange,
  EnvironmentalProtection,
  AbilityModifiers,
  AbilityScore,
  Resistance,
  SkillName,
  FactionRelations,
  FactionRelation
} from '../types';



// Helper functions
function parseDiceRange(diceString: string): DiceRange {
  // Handle strings like "2d8", "4d10", "1d6+2"
  const match = diceString.match(/(\d+)d(\d+)(?:\s*\+\s*(\d+))?/);
  if (!match) throw new Error(`Invalid dice string: ${diceString}`);
  
  const [_, numDice, diceSize, bonus] = match;
  const min = Number(numDice) + (Number(bonus) || 0);
  const max = Number(numDice) * Number(diceSize) + (Number(bonus) || 0);
  
  return { min, max };
}

function parseEnvironmentalProtection(lines: string[]): EnvironmentalProtection {
  const protection: EnvironmentalProtection = {};
  
  for (const line of lines) {
    const match = line.match(/(\w+):\s*\+(\d+)/);
    if (match) {
      const [_, type, value] = match;
      const resistanceType = type.toLowerCase() as Resistance;
      if (isValidResistance(resistanceType)) {
        protection[resistanceType] = Number(value);
      }
    }
  }
  
  return protection;
}

function parseAbilityModifiers(line: string): AbilityModifiers {
  const modifiers: AbilityModifiers = {};
  const matches = line.match(/\+(\d+)\s+([A-Z]{3})/g) || [];
  
  for (const match of matches) {
    const [_, value, ability] = match.match(/\+(\d+)\s+([A-Z]{3})/) || [];
    if (value && ability && isValidAbilityScore(ability)) {
      modifiers[ability] = Number(value);
    }
  }
  
  return modifiers;
}

// Type guards
function isValidResistance(type: string): type is Resistance {
  return ['cold', 'heat', 'toxin', 'radiation', 'seismic'].includes(type);
}

function isValidAbilityScore(score: string): score is AbilityScore {
  return ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].includes(score);
}

function parseArmorClass(acLine: string): { baseAC: number; dexBonus: number } {
  // Handle lines like "11 + Dexterity modifier (maximum +3)"
  const match = acLine.match(/(\d+)\s*\+\s*Dexterity modifier\s*\(maximum \+(\d+)\)/);
  if (!match) throw new Error(`Invalid armor class format: ${acLine}`);
  
  return {
    baseAC: Number(match[1]),
    dexBonus: Number(match[2])
  };
}

function parseDamage(damageString: string): { damage: string; damageType: DamageType; damageRange: DiceRange } {
  // Handle special case where damage type is in parentheses
  const cleanedString = damageString.replace(/\(varies.*\)/, 'varies');
  
  // Split "2d8 bludgeoning" into ["2d8", "bludgeoning"]
  const [diceStr, ...typeParts] = cleanedString.split(' ');
  const type = typeParts.join(' ').trim();  // Join back in case there were spaces
  
  if (!diceStr || !type) throw new Error(`Invalid damage format: ${damageString}`);

  // Validate damage type
  if (!isValidDamageType(type)) {
    throw new Error(`Invalid damage type: ${type}`);
  }

  return {
    damage: diceStr,
    damageType: type as DamageType,
    damageRange: parseDiceRange(diceStr)
  };
}

// Type guard for damage types
function isValidDamageType(type: string): type is DamageType {
  return ['piercing', 'slashing', 'bludgeoning', 'force', 'acid', 'psychic', 'fire', 'varies'].includes(type);
}

function parseCarryingCapacity(capacityString: string): number {
  // Handle strings like "+150 lbs"
  const match = capacityString.match(/\+(\d+)\s*lbs?/);
  if (!match) throw new Error(`Invalid carrying capacity format: ${capacityString}`);
  
  return Number(match[1]);
}

// Main parsing functions for each equipment type
export function parseSuits(content: string): Record<string, Suit> {
  // Skip implementation notes section
  const [_, suitsSection] = content.split('## Suits');
  if (!suitsSection) return {};
  
  // Split into individual suit entries
  const suitEntries = suitsSection.split('###').filter(Boolean);
  const suits: Record<string, Suit> = {};
  
  for (const entry of suitEntries) {
    const lines = entry.trim().split('\n');
    const name = lines[0].trim();
    
    const suit: Partial<Suit> = {
      environmentalProtection: {},
      abilityModifiers: {},
      properties: []
    };
    
    let currentSection = '';
    
    for (const line of lines.slice(1)) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      if (trimmedLine.startsWith('- ')) {
        const [key, value] = trimmedLine.slice(2).split(':').map(s => s?.trim());
        
        switch (key) {
          case 'Type':
            if (value === 'Light Armor' || value === 'Medium Armor' || value === 'Heavy Armor') {
              suit.type = value;
            }
            break;
            
          case 'Armor Class':
            const { baseAC, dexBonus } = parseArmorClass(value);
            suit.baseAC = baseAC;
            suit.dexBonus = dexBonus;
            break;
            
          case 'Properties':
            suit.properties = value.split(',').map(p => p.trim());
            break;
            
          case 'Environmental Protection':
            currentSection = 'env';
            break;
            
          case 'Ability Modifier':
            if (value) {
              suit.abilityModifiers = parseAbilityModifiers(value);
            }
            break;
            
          case 'Special':
            suit.special = value;
            break;
            
          case 'Industrial Use':
            suit.industrialUse = value;
            break;
            
          default:
            if (currentSection === 'env' && value) {
              const envProtection = parseEnvironmentalProtection([trimmedLine]);
              suit.environmentalProtection = {
                ...suit.environmentalProtection,
                ...envProtection
              };
            }
        }
      }
    }
    
    // Only add if we have all required fields
    if (suit.type && suit.baseAC !== undefined && suit.dexBonus !== undefined && 
        suit.industrialUse && suit.properties) {
      suits[name] = suit as Suit;
    }
  }
  
  return suits;
}

export function parseAccessories(content: string): Record<string, Accessory> {
  // Skip implementation notes section
  const [_, accessorySection] = content.split('## Accessories');
  if (!accessorySection) return {};
  
  // Split into individual accessory entries
  const accessoryEntries = accessorySection.split('###').filter(Boolean);
  const accessories: Record<string, Accessory> = {};
  
  for (const entry of accessoryEntries) {
    const lines = entry.trim().split('\n');
    const name = lines[0].trim();
    
    const accessory: Partial<Accessory> = {
      abilityModifiers: {},
      properties: []
    };
    
    for (const line of lines.slice(1)) {
      const trimmedLine = line.trim();
      if (!trimmedLine || !trimmedLine.startsWith('- ')) continue;
      
      const [key, value] = trimmedLine.slice(2).split(':').map(s => s?.trim());
      
      switch (key) {
        case 'Damage':
          const { damage, damageType, damageRange } = parseDamage(value);
          accessory.damage = damage;
          accessory.damageType = damageType;
          accessory.damageRange = damageRange;
          break;
          
        case 'Properties':
          accessory.properties = value.split(',').map(p => p.trim());
          break;
          
        case 'Ability Modifier':
          if (value) {
            accessory.abilityModifiers = parseAbilityModifiers(value);
          }
          break;
          
        case 'Special':
          accessory.special = value;
          break;
          
        case 'Industrial Use':
          accessory.industrialUse = value;
          break;
          
        case 'Range':
          accessory.range = value;
          break;
          
        case 'Additional Damage':
          accessory.additionalDamage = value;
          break;
      }
    }
    
    // Only add if we have all required fields
    if (accessory.damage && accessory.damageRange && accessory.properties && 
        accessory.industrialUse) {
      accessories[name] = accessory as Accessory;
    }
  }
  
  return accessories;
}

export function parseBackpacks(content: string): Record<string, Backpack> {
  // Skip implementation notes section
  const [_, backpackSection] = content.split('## Backpacks');
  if (!backpackSection) return {};
  
  // Split into individual backpack entries
  const backpackEntries = backpackSection.split('###').filter(Boolean);
  const backpacks: Record<string, Backpack> = {};
  
  for (const entry of backpackEntries) {
    const lines = entry.trim().split('\n');
    const name = lines[0].trim();
    
    const backpack: Partial<Backpack> = {
      environmentalProtection: {},
      properties: []
    };
    
    let currentSection = '';
    
    for (const line of lines.slice(1)) {
      const trimmedLine = line.trim();
      if (!trimmedLine || !trimmedLine.startsWith('- ')) continue;
      
      const [key, value] = trimmedLine.slice(2).split(':').map(s => s?.trim());
      
      switch (key) {
        case 'Type':
          backpack.type = value;
          break;
          
        case 'Carrying Capacity':
          backpack.carryingCapacity = parseCarryingCapacity(value);
          break;
          
        case 'Properties':
          backpack.properties = value.split(',').map(p => p.trim());
          break;
          
        case 'Environmental Protection':
          currentSection = 'env';
          break;
          
        case 'Special':
          backpack.special = value;
          break;
          
        case 'Warning':
          backpack.warning = value;
          break;
          
        case 'Industrial Use':
          backpack.industrialUse = value;
          break;
          
        default:
          if (currentSection === 'env' && value) {
            const envProtection = parseEnvironmentalProtection([trimmedLine]);
            backpack.environmentalProtection = {
              ...backpack.environmentalProtection,
              ...envProtection
            };
          }
      }
    }
    
    // Only add if we have all required fields
    if (backpack.type && backpack.carryingCapacity !== undefined && 
        backpack.properties && backpack.industrialUse) {
      backpacks[name] = backpack as Backpack;
    }
  }
  
  return backpacks;
}

function parseSkillProficiencies(lines: string[]): SkillName[] {
  const skills: SkillName[] = [];
  // console.log('Parsing skill proficiencies:', lines);  // Debug log
  for (const line of lines) {
    const skill = line.replace('-', '').trim();
    if (isValidSkill(skill)) {
      skills.push(skill);
    }
  }

  return skills;
}

function parseFactionRelations(lines: string[]): FactionRelations {
  const relations: FactionRelations = {};
  
  for (const line of lines) {
    // Remove the leading "- " before splitting
    const content = line.slice(2);
    const [faction, relation] = content.split(':').map(s => s.trim());
    
    if (faction && relation && isValidFactionRelation(relation)) {
      relations[faction] = relation as FactionRelation;
    }
  }
  
  return relations;
}

// Type guards
function isValidSkill(skill: string): skill is SkillName {
  return [
    'Acrobatics', 'Athletics', 'Deception', 'Engineering',
    'Geology', 'Intimidation', 'Investigation', 'Medicine',
    'Navigation', 'Perception', 'Performance', 'Persuasion',
    'Piloting', 'Scavenging', 'Stealth', 'Survival',
    'Toxicology', 'Trading'
  ].includes(skill);
}

function isValidFactionRelation(relation: string): relation is FactionRelation {
  return ['Allied', 'Friendly', 'Neutral', 'Unfriendly', 'Hostile'].includes(relation);
}

export function parseGraphics(content: string): Record<string, Graphic> {
  // Skip implementation notes section
  // console.log('Parsing graphics:', content.substring(0, 300));
  const [_, graphicsSection] = content.split('## Graphics');
  if (!graphicsSection) return {};
  
  // Split into individual graphic entries
  const graphicEntries = graphicsSection.split('###').filter(Boolean);
  const graphics: Record<string, Graphic> = {};
  
  for (const entry of graphicEntries) {
    const lines = entry.trim().split('\n');
    const name = lines[0].trim();
    
    const graphic: Partial<Graphic> = {
      type: '',
      abilityModifiers: {},
      skillProficiencies: [],
      factionRelations: {},
      industrialUse: ''
    };
    
    let currentSection = '';
    let factionLines: string[] = [];
    let skillLines: string[] = [];

    for (const line of lines.slice(1)) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      if (currentSection === 'skills') {
        if (trimmedLine.startsWith('- ') && !trimmedLine.includes('Faction Relations')){
          skillLines.push(trimmedLine);
        } else if (!trimmedLine.startsWith('  -')) {
          currentSection = '';
        }
      }

      if (currentSection === 'factions') {
        if (trimmedLine.startsWith('- ') && !trimmedLine.includes('Industrial Use')) {
          // This is a faction relation line
          factionLines.push(trimmedLine);
          continue;
        } else if (!trimmedLine.startsWith('  -')) {
          // We've left the faction relations section
          currentSection = '';
        }
      }

      
      
      if (trimmedLine.startsWith('- ')) {
        const [key, value] = trimmedLine.slice(2).split(':').map(s => s?.trim());
        
        switch (key) {
          case 'Type':
            graphic.type = value;
            break;
            
          case 'Skill Proficiencies':
            // graphic.skillProficiencies = parseSkillProficiencies(value);
            currentSection = 'skills';
            break;
            
          case 'Ability Modifier':
            graphic.abilityModifiers = parseAbilityModifiers(value);
            break;
            
          case 'Faction Relations':
            currentSection = 'factions';
            break;
            
          case 'Special':
            graphic.special = value;
            break;
            
          case 'Industrial Use':
            graphic.industrialUse = value;
            currentSection = '';  // Reset current section
            break;
        }
      }
    }
    
    // Parse faction relations after collecting all lines
    if (factionLines.length > 0) {
      // console.log('Parsing faction lines:', factionLines);  // Debug log
      graphic.factionRelations = parseFactionRelations(factionLines);
    }

    if (skillLines.length > 0) {
      // console.log('Parsing skill lines:', skillLines);  // Debug log
      graphic.skillProficiencies = parseSkillProficiencies(skillLines);
      // console.log('Skill proficiencies:', graphic.skillProficiencies);  // Debug log
    }
    
    // Only add if we have all required fields and they're valid
    if (graphic.type && 
        Array.isArray(graphic.skillProficiencies) && 
        graphic.skillProficiencies.length > 0 && 
        graphic.industrialUse) {
      graphics[name] = graphic as Graphic;
    }
  }
  
  return graphics;
}

export function parseHeadgear(content: string): Record<string, Headgear> {
  // Skip implementation notes section
  const [_, headgearSection] = content.split('## Headgear');
  if (!headgearSection) return {};
  
  // Split into individual headgear entries
  const headgearEntries = headgearSection.split('###').filter(Boolean);
  const headgear: Record<string, Headgear> = {};
  
  for (const entry of headgearEntries) {
    const lines = entry.trim().split('\n');
    const name = lines[0].trim();
    
    const gear: Partial<Headgear> = {
      type: '',
      acBonus: 0,
      properties: [],
      environmentalProtection: {},
      abilityModifiers: {},
      industrialUse: ''
    };
    
    let currentSection = '';
    
    for (const line of lines.slice(1)) {
      const trimmedLine = line.trim();
      if (!trimmedLine || !trimmedLine.startsWith('- ')) continue;
      
      const [key, value] = trimmedLine.slice(2).split(':').map(s => s?.trim());
      if (!value && key === 'Environmental Protection') {
        currentSection = 'env';
        continue;
      }
        
        switch (key) {
          case 'Type':
          gear.type = value;
            break;
          
        case 'AC Bonus':
          // Handle strings like "+1" or "+2"
          const acMatch = value.match(/\+(\d+)/);
          if (acMatch) {
            gear.acBonus = Number(acMatch[1]);
          }
            break;
          
          case 'Properties':
          gear.properties = value.split(',').map(p => p.trim());
          break;
          
        case 'Vision':
          gear.vision = value;
            break;
          
        case 'Special':
          gear.special = value;
            break;
          
          case 'Ability Modifier':
          gear.abilityModifiers = parseAbilityModifiers(value);
            break;
          
        case 'Warning':
          gear.warning = value;
            break;
          
          case 'Industrial Use':
          gear.industrialUse = value;
          currentSection = '';  // Reset current section
            break;
          
          default:
            if (currentSection === 'env' && value) {
            const envProtection = parseEnvironmentalProtection([trimmedLine]);
            gear.environmentalProtection = {
              ...gear.environmentalProtection,
              ...envProtection
            };
          }
      }
    }
    
    // Only add if we have all required fields
    if (gear.type && 
        gear.acBonus !== undefined && 
        gear.properties && 
        gear.industrialUse) {
      headgear[name] = gear as Headgear;
    }
  }
  
  return headgear;
}

// Main function to parse all equipment
export function parseEquipmentMarkdown(basePath: string) {
  const equipment = {
    suits: parseSuits(fs.readFileSync(`${basePath}/suits.md`, 'utf-8')),
    accessories: parseAccessories(fs.readFileSync(`${basePath}/accessory.md`, 'utf-8')),
    backpacks: parseBackpacks(fs.readFileSync(`${basePath}/backpack.md`, 'utf-8')),
    graphics: parseGraphics(fs.readFileSync(`${basePath}/graphic.md`, 'utf-8')),
    headgear: parseHeadgear(fs.readFileSync(`${basePath}/headgear.md`, 'utf-8'))
  };

  return equipment;
}
