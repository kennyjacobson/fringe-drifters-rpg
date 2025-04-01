import { Character, NFTTraits, DrifterAttribute, Suit, Accessory, Backpack, Graphic, Headgear, AbilityScore } from '../types';
import { equipmentDatabase, isValidEquipment } from '../data/equipment';
import { driftersDatabase, isValidDrifter } from '../data/drifters';

const typedDatabase = driftersDatabase as unknown as DrifterDatabase;
const typedEquipmentDatabase = equipmentDatabase as unknown as EquipmentDatabase;

/**
 * Calculates a complete character sheet from NFT traits
 * @param nftTraits The NFT's equipment traits
 * @returns A fully calculated character sheet with all stats and modifiers
 * @throws Error if any trait is invalid
 */
export function calculateCharacterAttributes(nftTraits: NFTTraits): Character {
  // Initialize character with base stats (as shown in your documentation)
  const character: Character = {
    abilityScores: {
      STR: 11,
      DEX: 11,
      CON: 11,
      INT: 11,
      WIS: 11,
      CHA: 11
    },
    baseAC: 9,
    resistances: {
      cold: 0,
      heat: 0,
      toxin: 0,
      radiation: 0,
      seismic: 0
    },
    skills: {
      Acrobatics: { ability: 'DEX', proficient: false, modifier: 0 },
      Athletics: { ability: 'STR', proficient: false, modifier: 0 },
      Deception: { ability: 'CHA', proficient: false, modifier: 0 },
      Engineering: { ability: 'INT', proficient: false, modifier: 0 },
      Geology: { ability: 'INT', proficient: false, modifier: 0 },
      Intimidation: { ability: 'CHA', proficient: false, modifier: 0 },
      Investigation: { ability: 'INT', proficient: false, modifier: 0 },
      Medicine: { ability: 'WIS', proficient: false, modifier: 0 },
      Navigation: { ability: 'INT', proficient: false, modifier: 0 },
      Perception: { ability: 'WIS', proficient: false, modifier: 0 },
      Performance: { ability: 'CHA', proficient: false, modifier: 0 },
      Persuasion: { ability: 'CHA', proficient: false, modifier: 0 },
      Piloting: { ability: 'DEX', proficient: false, modifier: 0 },
      Scavenging: { ability: 'DEX', proficient: false, modifier: 0 },
      Stealth: { ability: 'DEX', proficient: false, modifier: 0 },
      Survival: { ability: 'WIS', proficient: false, modifier: 0 },
      Toxicology: { ability: 'INT', proficient: false, modifier: 0 },
      Trading: { ability: 'INT', proficient: false, modifier: 0 }
    },
    equipment: {
      suit: null,
      headgear: null,
      accessory: null,
      backpack: null,
      graphic: null
    },
    carryingCapacity: 0
  };

  // Process each trait
  if (nftTraits.suit && isValidEquipment('suits', nftTraits.suit)) {
    applySuitBonuses(character, nftTraits.suit);
  }

  // Check for either accessory or mech suit, but not both
  if (nftTraits.mechSuit) {
    applyMechSuitBonuses(character, nftTraits.mechSuit);
  } else if (nftTraits.accessory && isValidEquipment('accessories', nftTraits.accessory)) {
    applyAccessoryBonuses(character, nftTraits.accessory);
  }

  if (nftTraits.backpack && isValidEquipment('backpacks', nftTraits.backpack)) {
    applyBackpackBonuses(character, nftTraits.backpack);
  }

  if (nftTraits.graphic && isValidEquipment('graphics', nftTraits.graphic)) {
    applyGraphicBonuses(character, nftTraits.graphic);
  }

  if (nftTraits.headgear && isValidEquipment('headgear', nftTraits.headgear)) {
    applyHeadgearBonuses(character, nftTraits.headgear);
  }

  // Calculate skill modifiers after all ability scores and proficiencies are set
  calculateSkillModifiers(character);

  return character;
}

export function getDrifter(drifterId: number): Character {
    if (!isValidDrifter(drifterId)) {
      throw new Error(`Invalid drifter ID: ${drifterId}`);
    }

  console.log("drifterId", drifterId);
  console.log("typeof driftersDatabase", typeof driftersDatabase);

  const drifter = typedDatabase[drifterId.toString()];
  console.log(drifter);
  
  if (!drifter) {
    throw new Error(`Drifter with ID ${drifterId} not found in database`);
  }

  const nftTraits: NFTTraits = {
    suit: drifter.attributes.find((attr: DrifterAttribute) => attr.trait_type === 'Suit')?.value,
    accessory: drifter.attributes.find((attr: DrifterAttribute) => attr.trait_type === 'Accessory')?.value,
    headgear: drifter.attributes.find((attr: DrifterAttribute) => attr.trait_type === 'Headgear')?.value,
    backpack: drifter.attributes.find((attr: DrifterAttribute) => attr.trait_type === 'Backpack')?.value,
    graphic: drifter.attributes.find((attr: DrifterAttribute) => attr.trait_type === 'Graphic')?.value,
    mechSuit: drifter.attributes.find((attr: DrifterAttribute) => attr.trait_type === 'Mech Suit')?.value
  };
  return calculateCharacterAttributes(nftTraits);
}

// Helper functions
function applySuitBonuses(character: Character, suitName: string): void {
  // Implementation
  const suit = typedEquipmentDatabase.suits[suitName];
  if (!suit) {
    throw new Error(`Invalid suit: ${suitName}`);
  }

  // Apply armor bonuses
  character.baseAC += (suit.baseAC - 9);

  // Apply environmental protection
  character.resistances.cold += suit.environmentalProtection.cold || 0;
  character.resistances.heat += suit.environmentalProtection.heat || 0;
  character.resistances.toxin += suit.environmentalProtection.toxin || 0;
  character.resistances.radiation += suit.environmentalProtection.radiation || 0;
  character.resistances.seismic += suit.environmentalProtection.seismic || 0;

  // Apply ability modifiers
  character.abilityScores.CON += suit.abilityModifiers.CON || 0;
  character.abilityScores.DEX += suit.abilityModifiers.DEX || 0;
  character.abilityScores.STR += suit.abilityModifiers.STR || 0;
  character.abilityScores.WIS += suit.abilityModifiers.WIS || 0;
  character.abilityScores.CHA += suit.abilityModifiers.CHA || 0;
  character.abilityScores.INT += suit.abilityModifiers.INT || 0;

  character.equipment.suit = {...suit, name: suitName};


}

function applyAccessoryBonuses(character: Character, accessoryName: string): void {
  const accessory = typedEquipmentDatabase.accessories[accessoryName];
  if (!accessory) {
    throw new Error(`Invalid accessory: ${accessoryName}`);
  }

  // Apply ability modifiers
  for (const [ability, modifier] of Object.entries(accessory.abilityModifiers)) {
    character.abilityScores[ability as AbilityScore] += modifier;
  }

  // Store the accessory in character equipment
  character.equipment.accessory = {...accessory, name: accessoryName};
  console.log("character.equipment.accessory", character.equipment.accessory);
}

function applyBackpackBonuses(character: Character, backpackName: string): void {
  const backpack = typedEquipmentDatabase.backpacks[backpackName];
  if (!backpack) {
    throw new Error(`Invalid backpack: ${backpackName}`);
  }

  // Apply carrying capacity
  character.carryingCapacity += backpack.carryingCapacity;

  // Apply environmental protection if any
  character.resistances.cold += backpack.environmentalProtection.cold || 0;
  character.resistances.heat += backpack.environmentalProtection.heat || 0;
  character.resistances.toxin += backpack.environmentalProtection.toxin || 0;
  character.resistances.radiation += backpack.environmentalProtection.radiation || 0;
  character.resistances.seismic += backpack.environmentalProtection.seismic || 0;

  // Store the backpack in character equipment
  character.equipment.backpack = {...backpack, name: backpackName};
}

function applyGraphicBonuses(character: Character, graphicName: string): void {
  const graphic = typedEquipmentDatabase.graphics[graphicName];
  if (!graphic) {
    throw new Error(`Invalid graphic: ${graphicName}`);
  }

  // Apply ability modifiers
  for (const [ability, modifier] of Object.entries(graphic.abilityModifiers)) {
    character.abilityScores[ability as AbilityScore] += modifier;
  }

  // Apply skill proficiencies
  for (const skillName of graphic.skillProficiencies) {
    character.skills[skillName].proficient = true;
    // Note: Skill modifiers will need to be recalculated after all ability scores are finalized
  }

  // Store the graphic in character equipment
  character.equipment.graphic = {...graphic, name: graphicName};
}

function applyHeadgearBonuses(character: Character, headgearName: string): void {
  const headgear = typedEquipmentDatabase.headgear[headgearName];
  if (!headgear) {
    throw new Error(`Invalid headgear: ${headgearName}`);
  }

  // Apply AC bonus
  character.baseAC += headgear.acBonus;

  // Apply ability modifiers
  for (const [ability, modifier] of Object.entries(headgear.abilityModifiers)) {
    character.abilityScores[ability as AbilityScore] += modifier;
  }

  // Apply environmental protection
  character.resistances.cold += headgear.environmentalProtection.cold || 0;
  character.resistances.heat += headgear.environmentalProtection.heat || 0;
  character.resistances.toxin += headgear.environmentalProtection.toxin || 0;
  character.resistances.radiation += headgear.environmentalProtection.radiation || 0;
  character.resistances.seismic += headgear.environmentalProtection.seismic || 0;

  // Store the headgear in character equipment
  character.equipment.headgear = {...headgear, name: headgearName};
}

function applyMechSuitBonuses(character: Character, mechSuitName: string): void {
  // Convert the NFT trait name format to the equipment database format
  const formattedName = formatMechSuitName(mechSuitName);
  const mechSuit = typedEquipmentDatabase.accessories[formattedName];
  
  if (!mechSuit) {
    throw new Error(`Invalid mech suit: ${mechSuitName}`);
  }

  // Apply ability modifiers from the mech suit
  for (const [ability, modifier] of Object.entries(mechSuit.abilityModifiers)) {
    character.abilityScores[ability as AbilityScore] += modifier;
  }

  // Add additional AC bonus for mech suit coverage
  character.baseAC += 2; // Bump AC by 2 for the additional protection

  // Store the mech suit in character equipment (using the accessory slot)
  character.equipment.accessory = {...mechSuit, name: mechSuitName};
}

function formatMechSuitName(mechSuitName: string): string {
  // Convert from NFT format "''VICE GRIP''" to equipment format "Vice Grip Mech"
  return mechSuitName
    .replace(/[''"]/g, '') // Remove quotes
    .toLowerCase() // Convert to lowercase
    .split(' ') // Split into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
    .join(' ') + ' Mech'; // Add 'Mech' suffix
}

/**
 * Calculates the modifier for an ability score using D&D rules
 * @param score The ability score value
 * @returns The calculated modifier (floor((score - 10) / 2))
 */
function calculateAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

function calculateSkillModifiers(character: Character): void {
  // For each skill, calculate its modifier based on:
  // 1. The relevant ability score modifier
  // 2. Proficiency bonus (+2 if proficient)
  for (const [_, skill] of Object.entries(character.skills)) {
    // console.log("skillName", skillName);
    const abilityModifier = calculateAbilityModifier(character.abilityScores[skill.ability]);
    const proficiencyBonus = skill.proficient ? 2 : 0;
    skill.modifier = abilityModifier + proficiencyBonus;
  }
}

// function calculateDerivedStats(character: Character): void {
//   // Implementation from your documentation
// }



interface DrifterDatabase {
  [key: string]: {
    name: string;
    description: string;
    image: string;
    attributes: {
      trait_type: string;
      value: string;
    }[];
  };
}

interface EquipmentDatabase {
  suits: Record<string, Suit>;
  accessories: Record<string, Accessory>;
  backpacks: Record<string, Backpack>;
  graphics: Record<string, Graphic>;
  headgear: Record<string, Headgear>;
}
