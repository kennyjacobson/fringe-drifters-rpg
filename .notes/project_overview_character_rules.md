# Fringe RPG System Design: Core Mechanics and NFT Integration

## Project Overview
We are developing an RPG system that transforms NFT traits from the Fringe Drifters collection on Ethereum into functional RPG attributes. The system allows NFT owners to use their digital assets as playable characters in tabletop or digital RPG implementations.

## Core Design Decisions

### 1. Character Ability Score Generation
- Start with base array of 8,8,8,8,8,8 for all ability scores (STR, DEX, CON, INT, WIS, CHA)
- Apply deterministic bonuses based on NFT traits (equipment, iconography, etc.)
- No random dice rolling for character creation - traits directly determine abilities

### 2. Armor Class System
- Base AC = 10 + DEX modifier for unarmored characters
- Armor (suits) provides AC bonuses based on type:
  - Light: 11-12 + DEX (max +3)
  - Medium: 13-15 + DEX (max +2)
  - Heavy: 16-17 + DEX (max +1)
  - Mech Suits: Fixed AC values (15-17)
- Helmets/masks provide additional AC bonuses (+0 to +3)
- Environmental protection values separate from combat AC

### 3. Weapon/Accessory Implementation
- Weapons have standardized damage expressions (e.g., 1d6, 2d8)
- Damage types include: piercing, slashing, bludgeoning, etc.
- Special properties (finesse, heavy, reach, etc.) affect usage
- Industrial uses noted for non-combat functionality
- Mech suits provide both armor and weapon capabilities

### 4. Equipment Slots
- Body armor (suits)
- Headgear (helmets/masks)
- Accessory/weapon
- Backpack
- Mouth machine
- Iconography/affiliation

### 5. Environmental Resistance System
- Equipment provides resistance ratings to different hazard types:
  - Cold resistance
  - Heat resistance
  - Toxin resistance
  - Radiation resistance
  - Seismic resistance
- Rating scale: +0 (no protection), +2 (moderate), +5 (high)

### 6. Iconography and Faction System
- NFT iconography determines faction affiliations and grants:
  - Ability score bonuses
  - Skill proficiencies
  - Background elements
  - Social relationship modifiers

### 7. Backpack System
- Base carrying capacity: 50 + (STR × 5) pounds
- Backpacks increase carrying capacity based on type:
  - Utility packs (e.g., Squirrel Pack): +75-100 lbs
  - Heavy-duty packs (e.g., Caddypack): +125-150 lbs
  - Specialized packs (e.g., Bobpack): +50-75 lbs with special features
- Some backpacks provide additional environmental resistances
- Special properties vary by pack type (waterproof, modular, etc.)

### 8. Mouth Machine System
- Provides ability to analyze and safely consume substances
- Grants bonuses to specific abilities:
  - Analytical models: INT bonuses
  - Perceptive models: WIS bonuses
  - Protective models: CON bonuses
- Special properties include:
  - Toxin resistance
  - Environmental analysis
  - Sample preservation
  - Data storage

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

```javascript
function calculateCharacterAttributes(nftTraits) {
  // Initialize base attributes
  let character = {
    abilityScores: {
      STR: 8,
      DEX: 8,
      CON: 8,
      INT: 8,
      WIS: 8,
      CHA: 8
    },
    baseAC: 10,
    resistances: {
      cold: 0,
      heat: 0,
      toxin: 0,
      radiation: 0,
      seismic: 0
    },
    skills: {
      "Acrobatics": { ability: "DEX", proficient: false, modifier: 0 },
      "Athletics": { ability: "STR", proficient: false, modifier: 0 },
      "Deception": { ability: "CHA", proficient: false, modifier: 0 },
      "Engineering": { ability: "INT", proficient: false, modifier: 0 },
      "Geology": { ability: "INT", proficient: false, modifier: 0 },
      "Intimidation": { ability: "CHA", proficient: false, modifier: 0 },
      "Investigation": { ability: "INT", proficient: false, modifier: 0 },
      "Medicine": { ability: "WIS", proficient: false, modifier: 0 },
      "Navigation": { ability: "INT", proficient: false, modifier: 0 },
      "Perception": { ability: "WIS", proficient: false, modifier: 0 },
      "Performance": { ability: "CHA", proficient: false, modifier: 0 },
      "Persuasion": { ability: "CHA", proficient: false, modifier: 0 },
      "Piloting": { ability: "DEX", proficient: false, modifier: 0 },
      "Scavenging": { ability: "WIS", proficient: false, modifier: 0 },
      "Stealth": { ability: "DEX", proficient: false, modifier: 0 },
      "Survival": { ability: "WIS", proficient: false, modifier: 0 },
      "Toxicology": { ability: "INT", proficient: false, modifier: 0 },
      "Trading": { ability: "CHA", proficient: false, modifier: 0 }
    },
    equipment: {
      suit: null,
      helmet: null,
      accessory: null,
      backpack: null,
      mouthMachine: null,
      iconography: null
    },
    carryingCapacity: 0
  };
  
  // Process suit trait
  if (nftTraits.suit) {
    character.equipment.suit = nftTraits.suit;
    applyArmorBonuses(character, nftTraits.suit);
    applyAbilityScoreBonuses(character, nftTraits.suit);
    applyResistanceBonuses(character, nftTraits.suit);
  }
  
  // Process helmet/mask trait
  if (nftTraits.helmet) {
    character.equipment.helmet = nftTraits.helmet;
    applyHelmetBonuses(character, nftTraits.helmet);
  }
  
  // Process accessory/weapon trait
  if (nftTraits.accessory) {
    character.equipment.accessory = nftTraits.accessory;
    applyAccessoryBonuses(character, nftTraits.accessory);
  }
  
  // Process backpack trait
  if (nftTraits.backpack) {
    character.equipment.backpack = nftTraits.backpack;
    applyBackpackBonuses(character, nftTraits.backpack);
  }
  
  // Process mouth machine trait
  if (nftTraits.mouthMachine) {
    character.equipment.mouthMachine = nftTraits.mouthMachine;
    applyMouthMachineBonuses(character, nftTraits.mouthMachine);
  }
  
  // Process iconography
  if (nftTraits.iconography) {
    character.equipment.iconography = nftTraits.iconography;
    applyIconographyBonuses(character, nftTraits.iconography);
  }
  
  // Add a new function to apply skill proficiencies
  function applySkillProficiencies(character, trait, source) {
    if (equipmentDatabase[source][trait].skillProficiencies) {
      equipmentDatabase[source][trait].skillProficiencies.forEach(skill => {
        character.skills[skill].proficient = true;
      });
    }
    
    if (equipmentDatabase[source][trait].skillBonuses) {
      for (let skill in equipmentDatabase[source][trait].skillBonuses) {
        character.skills[skill].bonus = 
          (character.skills[skill].bonus || 0) + 
          equipmentDatabase[source][trait].skillBonuses[skill];
      }
    }
  }
  
  // Apply skill proficiencies from traits
  if (nftTraits.iconography) {
    applySkillProficiencies(character, nftTraits.iconography, "iconography");
  }
  
  if (nftTraits.suit) {
    applySkillProficiencies(character, nftTraits.suit, "suits");
  }
  
  // Calculate derived statistics
  calculateDerivedStats(character);
  
  return character;
}

function calculateDerivedStats(character) {
  // Calculate ability modifiers
  character.abilityModifiers = {};
  for (let ability in character.abilityScores) {
    character.abilityModifiers[ability] = Math.floor((character.abilityScores[ability] - 10) / 2);
  }
  
  // Calculate AC
  character.armorClass = character.baseAC + character.abilityModifiers.DEX;
  
  // Calculate carrying capacity
  character.carryingCapacity = 50 + (character.abilityScores.STR * 5);
  if (character.equipment.backpack) {
    character.carryingCapacity += equipmentDatabase.backpacks[character.equipment.backpack].carryingCapacity;
  }
  
  // Calculate skill modifiers
  for (let skillName in character.skills) {
    const skill = character.skills[skillName];
    const abilityMod = character.abilityModifiers[skill.ability];
    let proficiencyBonus = 0;
    
    if (skill.proficient) {
      proficiencyBonus = 2; // Base proficiency bonus
    }
    
    skill.modifier = abilityMod + proficiencyBonus + (skill.bonus || 0);
  }
}
```

## Data Structure for Trait-to-Attribute Mapping

```javascript
const equipmentDatabase = {
  suits: {
    "Gutter Shirt": {
      acBonus: 1,
      maxDex: 3,
      abilityBonuses: { CON: 1 },
      resistances: {},
      properties: ["durable", "low-cost"]
    },
    "Smocker": {
      acBonus: 3,
      maxDex: 2,
      abilityBonuses: { CON: 2 },
      resistances: { cold: 2, heat: 2 },
      properties: ["insulated"]
    },
    "Fursuit": {
      skillBonuses: { "Survival": 1, "Intimidation": 1 },
      // Other properties...
    },
    // Additional suits...
  },
  
  helmets: {
    // Helmet definitions with bonuses
  },
  
  accessories: {
    "Thruster": {
      damage: "2d8",
      damageType: "bludgeoning",
      abilityBonuses: { STR: 2 },
      properties: ["heavy", "two-handed"],
      industrialUse: "Breaking rock and minerals"
    },
    "Bolt Harp": {
      skillBonuses: { "Stealth": 1 }, // Quieter weapon
      // Other properties...
    },
    // Additional accessories...
  },
  
  backpacks: {
    "Caddypack": {
      carryingCapacity: 150,
      abilityBonuses: {},
      resistances: { physical: 2 },
      properties: ["heavy", "waterproof", "structural"],
      special: "Can be used as shelter in emergencies"
    },
    "Squirrel Pack": {
      carryingCapacity: 100,
      abilityBonuses: {},
      properties: ["modular", "versatile", "common"],
      special: "Built-in tarp and breather tube"
    },
    // Additional backpacks...
  },
  
  mouthMachines: {
    "The Beetle": {
      skillBonuses: { "Toxicology": 2 }, // Analysis capabilities
      resistances: { toxin: 3 },
      properties: ["heavy", "analytical", "data storage"],
      special: "Can safely process and analyze unknown substances"
    },
    "Bincal Mouth Machine": {
      abilityBonuses: { WIS: 1, CON: 1 },
      resistances: { toxin: 2 },
      properties: ["lightweight", "olfactory enhancement"],
      special: "Enhanced scent perception for substance identification"
    },
    // Additional mouth machines...
  },
  
  iconography: {
    "Cove Stalkers": {
      skillProficiencies: ["Stealth", "Intimidation"],
      abilityBonuses: { STR: 1, CHA: 1 },
      factionRelations: {
        "Round Power": "hostile",
        "Dugall Freight": "neutral"
      }
    },
    "Engineers Guild": {
      skillProficiencies: ["Engineering", "Investigation"],
      abilityBonuses: { INT: 1 },
      factionRelations: {
        "Round Power": "neutral"
      }
    },
    "Survivalist Guild": {
      skillProficiencies: ["Survival", "Medicine"],
      abilityBonuses: { WIS: 1 },
      factionRelations: {
        "Round Power": "neutral"
      }
    },
    "Round Power": {
      skillProficiencies: ["Athletics", "Geology"],
      abilityBonuses: { STR: 1 },
      factionRelations: {
        "Round Power": "hostile"
      }
    },
    "Void Drifter": {
      skillProficiencies: ["Piloting", "Scavenging"],
      abilityBonuses: { DEX: 1 },
      factionRelations: {
        "Round Power": "neutral"
      }
    },
    // More iconography...
  }
}
```

## Character Sheet Design Intent

The character sheet presents all NFT-derived attributes in a clear format:
- Basic Information (name, level, etc.)
- Ability Scores with modifiers
- Combat Statistics (AC, HP, etc.)
- Equipment with derived bonuses
- Carrying capacity and encumbrance
- Environmental resistances
- Faction relationships
- Skills and proficiencies
- Special equipment properties

## Specimens as Separate Elements

While specimens (ERC-1155 NFTs) are not intrinsic character traits, they can be:
- Collected and carried in appropriate backpacks
- Analyzed using mouth machines
- Traded with factions for reputation or resources
- Used for temporary bonuses during gameplay

## Implementation Goals

1. Create a deterministic, transparent system for NFT trait conversion
2. Balance gameplay mechanics with NFT collectible value
3. Allow for character advancement without changing the NFT
4. Provide sufficient mechanical depth for engaging gameplay
5. Create a foundation for multiple game implementations using the same character data

This framework allows for programmatic generation of character sheets directly from NFT metadata, while maintaining game balance and providing meaningful mechanical differentiation between characters.
