# Fringe RPG System Design: Core Mechanics and NFT Integration

## Project Overview
We are developing an RPG system that transforms NFT traits from the Fringe Drifters collection on Ethereum into functional RPG attributes. The system allows NFT owners to use their digital assets as playable characters in tabletop or digital RPG implementations.

## Core Design Decisions

### 1. Character Ability Score Generation
- Start with base array of 11,11,11,11,11,11 for all ability scores (STR, DEX, CON, INT, WIS, CHA)
- Apply deterministic bonuses based on NFT traits (equipment, iconography, etc.)
- No random dice rolling for character creation - traits directly determine abilities

### 2. Armor Class System
- Base AC = 10 + DEX modifier for unarmored characters
- Armor (suits) provides AC bonuses based on type:
  - Light: 11-12 + DEX (max +3)
  - Medium: 13-15 + DEX (max +2)
  - Heavy: 16-17 + DEX (max +1)
  - Mech Suits: Fixed AC values (15-17)
- Headgear provides additional AC bonuses (+0 to +3)
- Environmental protection values separate from combat AC

### 3. Weapon/Accessory Implementation
- Weapons have standardized damage expressions (e.g., 1d6, 2d8)
- Damage types include: piercing, slashing, bludgeoning, force, acid, psychic, fire, varies
- Special properties affect usage and combat mechanics
- Industrial uses noted for non-combat functionality
- Optional range properties for ranged weapons
- Additional damage types for complex weapon systems
- Mech suits provide both armor and weapon capabilities

### 4. Equipment Slots
- Body armor (suits)
- Headgear (helmets/masks)
- Accessory/weapon
- Backpack
- Graphic (iconography/affiliation)

### 5. Environmental Protection System
- Equipment provides protection ratings to different hazard types:
  - Cold resistance
  - Heat resistance
  - Toxin resistance
  - Radiation resistance
  - Seismic resistance
  - Vacuum protection
  - Pressure protection
  - Sound protection
  - Water protection
  - Particulate protection
- Each piece of equipment can provide different levels of protection for different hazards
- Protection values are optional per hazard type
- Rating scale: +0 (no protection), +2 (moderate), +5 (high)

### 6. Graphic and Faction System
- NFT graphics determine faction affiliations and grants:
  - Ability score bonuses
  - Skill proficiencies
  - Background elements
  - Social relationship modifiers
- Faction relations have five levels:
  - Allied
  - Friendly
  - Neutral
  - Unfriendly
  - Hostile
- Relations are stored as a record of faction names to relation types

### 7. Backpack System
- Base carrying capacity: 50 + (STR × 5) pounds
- Backpacks increase carrying capacity based on type
- Some backpacks provide additional environmental resistances
- Special properties vary by pack type (waterproof, modular, etc.)
- Warning properties for hazardous or special conditions
- Industrial use properties for non-combat functionality

### 8. Headgear System
- Provides AC bonuses
- Environmental protection values
- Vision properties for special sight capabilities
- Warning properties for hazardous conditions
- Ability modifiers
- Industrial use properties
- Special properties (e.g., integrated systems)

## Skills
| Skill | Ability | Modifier | Proficient? |
|-------|---------|----------|-------------|
| Acrobatics | DEX | ___ | □ |
| Athletics | STR | ___ | □ |
| Deception | CHA | ___ | □ |
| Engineering | INT | ___ | □ |
| Geology | INT | ___ | □ |
| Intimidation | CHA | ___ | □ |
| Investigation | INT | ___ | □ |
| Medicine | WIS | ___ | □ |
| Navigation | INT | ___ | □ |
| Perception | WIS | ___ | □ |
| Performance | CHA | ___ | □ |
| Persuasion | CHA | ___ | □ |
| Piloting | DEX | ___ | □ |
| Scavenging | WIS | ___ | □ |
| Stealth | DEX | ___ | □ |
| Survival | WIS | ___ | □ |
| Toxicology | INT | ___ | □ |
| Trading | CHA | ___ | □ |

## Implementation Logic for Programmatic Processing

```typescript
// Core types for character attributes
type AbilityScore = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';
type Resistance = 'cold' | 'heat' | 'toxin' | 'radiation' | 'seismic' | 'vacuum' | 'pressure' | 'sound' | 'water' | 'particulate';

type Character = {
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

// NFT trait structure
type NFTTraits = {
  suit?: string;
  headgear?: string;
  accessory?: string;
  backpack?: string;
  graphic?: string;
  mechSuit?: string;
};

// Equipment types with expanded properties
type Suit = {
  type: 'Light Armor' | 'Medium Armor' | 'Heavy Armor';
  baseAC: number;
  dexBonus: number;
  properties: string[];
  environmentalProtection: EnvironmentalProtection;
  abilityModifiers: AbilityModifiers;
  special?: string;
  industrialUse: string;
};

type Accessory = {
  damage: string;
  damageRange: DiceRange;
  damageType: DamageType;
  properties: string[];
  abilityModifiers: AbilityModifiers;
  special?: string;
  additionalDamage?: string;
  industrialUse: string;
  range?: string;
};

type Headgear = {
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

type Graphic = {
  type: string;
  abilityModifiers: AbilityModifiers;
  skillProficiencies: SkillName[];
  factionRelations?: FactionRelations;
  special?: string;
  industrialUse: string;
};
```

## Character Sheet Design Intent

The character sheet presents all NFT-derived attributes in a clear format:
- Basic Information (name, level, etc.)
- Ability Scores with modifiers
- Combat Statistics (AC, HP, etc.)
- Equipment with derived bonuses
- Carrying capacity and encumbrance
- Environmental protections
- Faction relationships
- Skills and proficiencies
- Special equipment properties
- Industrial use capabilities
- Warning conditions

## Specimens as Separate Elements

While specimens (ERC-1155 NFTs) are not intrinsic character traits, they can be:
- Collected and carried in appropriate backpacks
- Analyzed using specialized equipment
- Traded with factions for reputation or resources
- Used for temporary bonuses during gameplay

## Implementation Goals

1. Create a deterministic, transparent system for NFT trait conversion
2. Balance gameplay mechanics with NFT collectible value
3. Allow for character advancement without changing the NFT
4. Provide sufficient mechanical depth for engaging gameplay
5. Create a foundation for multiple game implementations using the same character data
6. Maintain type safety throughout the system
7. Support comprehensive environmental hazards and protections
8. Enable industrial and non-combat uses of equipment

This framework allows for programmatic generation of character sheets directly from NFT metadata, while maintaining game balance and providing meaningful mechanical differentiation between characters.
