export type AbilityScore = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

export type Resistance = 'cold' | 'heat' | 'toxin' | 'radiation' | 'seismic';

export type SkillName = 
  | 'Acrobatics' | 'Athletics' | 'Deception' | 'Engineering' 
  | 'Geology' | 'Intimidation' | 'Investigation' | 'Medicine'
  | 'Navigation' | 'Perception' | 'Performance' | 'Persuasion'
  | 'Piloting' | 'Scavenging' | 'Stealth' | 'Survival'
  | 'Toxicology' | 'Trading';

export type Skill = {
  ability: AbilityScore;
  proficient: boolean;  // Comes from Graphic/iconography
  modifier: number;     // ability modifier + (proficient ? 2 : 0)
};

export type Character = {
  abilityScores: Record<AbilityScore, number>;
  baseAC: number;
  resistances: Record<Resistance, number>;
  skills: Record<SkillName, Skill>;
  equipment: {
    suit: Suit | null;
    headgear: Headgear | null;
    accessory: Accessory | null;
    backpack: Backpack | null;
    graphic: Graphic | null;
  };
  carryingCapacity: number;
};

export type NFTTraits = {
  suit?: string;
  headgear?: string;
  accessory?: string;
  backpack?: string;
  graphic?: string;
  mechSuit?: string;
};

// Base types for common properties
export type EnvironmentalProtection = {
  cold?: number;
  heat?: number;
  toxin?: number;
  radiation?: number;
  seismic?: number;
  physical?: number;
  vacuum?: number;
  pressure?: number;
  sound?: number;
  water?: number;
  particulate?: number;
};

export type AbilityModifiers = {
  STR?: number;
  DEX?: number;
  CON?: number;
  INT?: number;
  WIS?: number;
  CHA?: number;
};

export type FactionRelation = 'Allied' | 'Friendly' | 'Neutral' | 'Unfriendly' | 'Hostile';
export type FactionRelations = Record<string, FactionRelation>;

// Equipment-specific types
export type DamageType = 
  | 'piercing' | 'slashing' | 'bludgeoning' 
  | 'force' | 'acid' | 'psychic' | 'fire' | 'varies';

export type Suit = {
  name: string;
  type: 'Light Armor' | 'Medium Armor' | 'Heavy Armor';
  baseAC: number;           // Base armor value
  dexBonus: number;         // Fixed DEX bonus (like +2)
  properties: string[];
  environmentalProtection: EnvironmentalProtection;
  abilityModifiers: AbilityModifiers;
  special?: string;
  industrialUse: string;
};

export type DiceRange = {
  min: number;
  max: number;
};

export type Accessory = {
  name: string;
  damage: string;          // e.g., "4d10"
  damageRange: DiceRange;  // e.g., { min: 4, max: 40 }
  damageType: DamageType;
  properties: string[];
  abilityModifiers: AbilityModifiers;
  special?: string;
  additionalDamage?: string;  // Optional field for complex damage cases
  industrialUse: string;
  range?: string;
};

export type Backpack = {
  name: string;
  type: string;
  carryingCapacity: number;
  properties: string[];
  environmentalProtection: EnvironmentalProtection;
  special?: string;
  industrialUse: string;
  warning?: string;
};

// Graphic (iconography) determines skill proficiencies
export type Graphic = {
  name: string;
  type: string;
  abilityModifiers: AbilityModifiers;
  skillProficiencies: SkillName[];  // These grant +2 to those skills
  factionRelations?: FactionRelations;
  special?: string;
  industrialUse: string;
};

export type Headgear = {
  name: string;
  type: string;
  acBonus: number;
  properties: string[];
  environmentalProtection: EnvironmentalProtection;
  vision?: string;
  special?: string;
  abilityModifiers: AbilityModifiers;
  industrialUse: string;
  warning?: string;
};

export type DrifterAttribute = {
  trait_type: string;
  value: string;
};

export type DrifterMetadata = {
  name: string;
  description: string;
  image: string;
  attributes: readonly DrifterAttribute[];
};

export type DrifterDatabase = Record<number, DrifterMetadata>;

// Main equipment database type
export type EquipmentDatabase = {
  suits: Record<string, Suit>;
  accessories: Record<string, Accessory>;
  backpacks: Record<string, Backpack>;
  graphics: Record<string, Graphic>;
  headgear: Record<string, Headgear>;
};

// // Helper function for skill checks
// export function calculateSkillModifier(
//   abilityModifier: number,
//   proficient: boolean
// ): number {
//   return abilityModifier + (proficient ? 2 : 0);
// }

// // Example skill check function
// export function makeSkillCheck(
//   abilityModifier: number,
//   proficient: boolean
// ): number {
//   return Math.floor(Math.random() * 20) + 1 + calculateSkillModifier(abilityModifier, proficient);
// }