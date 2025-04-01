3.31.2025




Create a React component that displays a character sheet.
Create a React website that displays a character sheet component.

We will use React, Shadcn, and TailwindCSS for the website.

## Visual Layout & Structure
- responsive design using Shadcn/UI and TailwindCSS

## Key Information Sections
### Header Section
Character portrait/NFT image
Base stats (AC, carrying capacity)
Environmental resistances displayed as icons/badges

### Ability Scores Panel
Grid layout for STR, DEX, CON, INT, WIS, CHA
Each score with modifier clearly displayed

### Equipment Section
Visual cards for each equipment slot:
- Suit
- Headgear
- Accessory
- Backpack
- Graphic
Each card showing:
- Equipment type
- Properties
- Environmental protection
- Special abilities
- Industrial use

### Skills Grid
- Organized by ability score groups
- Clear indicators for proficiency
- Showing total modifiers
- Search/filter capability for quick reference


## Visual Theme
- Industrial/sci-fi aesthetic to match The Fringe theme
- Clear contrast for readability
- Status indicators using appropriate colors
- Icons for environmental resistances and properties


Here are some examples of character sheets JSON

```json
{
  "abilityScores": {
    "STR": 11,
    "DEX": 11,
    "CON": 12,
    "INT": 11,
    "WIS": 11,
    "CHA": 12
  },
  "baseAC": 11,
  "resistances": {
    "cold": 0,
    "heat": 0,
    "toxin": 1,
    "radiation": 0,
    "seismic": 0
  },
  "skills": {
    "Acrobatics": {
      "ability": "DEX",
      "proficient": false,
      "modifier": 0
    },
    "Athletics": {
      "ability": "STR",
      "proficient": false,
      "modifier": 0
    },
    "Deception": {
      "ability": "CHA",
      "proficient": true,
      "modifier": 3
    },
    "Engineering": {
      "ability": "INT",
      "proficient": false,
      "modifier": 0
    },
    "Geology": {
      "ability": "INT",
      "proficient": false,
      "modifier": 0
    },
    "Intimidation": {
      "ability": "CHA",
      "proficient": false,
      "modifier": 1
    },
    "Investigation": {
      "ability": "INT",
      "proficient": false,
      "modifier": 0
    },
    "Medicine": {
      "ability": "WIS",
      "proficient": false,
      "modifier": 0
    },
    "Navigation": {
      "ability": "INT",
      "proficient": false,
      "modifier": 0
    },
    "Perception": {
      "ability": "WIS",
      "proficient": false,
      "modifier": 0
    },
    "Performance": {
      "ability": "CHA",
      "proficient": true,
      "modifier": 3
    },
    "Persuasion": {
      "ability": "CHA",
      "proficient": false,
      "modifier": 1
    },
    "Piloting": {
      "ability": "DEX",
      "proficient": false,
      "modifier": 0
    },
    "Scavenging": {
      "ability": "DEX",
      "proficient": false,
      "modifier": 0
    },
    "Stealth": {
      "ability": "DEX",
      "proficient": false,
      "modifier": 0
    },
    "Survival": {
      "ability": "WIS",
      "proficient": false,
      "modifier": 0
    },
    "Toxicology": {
      "ability": "INT",
      "proficient": false,
      "modifier": 0
    },
    "Trading": {
      "ability": "INT",
      "proficient": false,
      "modifier": 0
    }
  },
  "equipment": {
    "suit": {
      "environmentalProtection": {},
      "abilityModifiers": {
        "CON": 1
      },
      "properties": [
        "Durable",
        "Low-cost"
      ],
      "type": "Light Armor",
      "baseAC": 11,
      "dexBonus": 3,
      "industrialUse": "Basic protection for general work"
    },
    "headgear": {
      "type": "Basic Mask",
      "acBonus": 0,
      "properties": [
        "Low-cost",
        "Disposable"
      ],
      "environmentalProtection": {
        "toxin": 1
      },
      "abilityModifiers": {},
      "industrialUse": "Emergency backup and temporary protection",
      "warning": "Seam seepage after extended use"
    },
    "accessory": {
      "abilityModifiers": {},
      "properties": [
        "Heavy",
        "Two-handed"
      ],
      "damage": "2d6",
      "damageType": "slashing",
      "damageRange": {
        "min": 2,
        "max": 12
      },
      "industrialUse": "Logging and timber processing"
    },
    "backpack": null,
    "graphic": {
      "type": "Secret Society",
      "abilityModifiers": {
        "CHA": 1
      },
      "skillProficiencies": [
        "Performance",
        "Deception"
      ],
      "factionRelations": {},
      "industrialUse": "Artistic and cultural operations",
      "special": "Advantage on art-related checks"
    }
  },
  "carryingCapacity": 0
}
```

```json
{
  "abilityScores": {
    "STR": 12,
    "DEX": 11,
    "CON": 13,
    "INT": 11,
    "WIS": 11,
    "CHA": 11
  },
  "baseAC": 15,
  "resistances": {
    "cold": 2,
    "heat": 2,
    "toxin": 0,
    "radiation": 0,
    "seismic": 0
  },
  "skills": {
    "Acrobatics": {
      "ability": "DEX",
      "proficient": false,
      "modifier": 0
    },
    "Athletics": {
      "ability": "STR",
      "proficient": true,
      "modifier": 3
    },
    "Deception": {
      "ability": "CHA",
      "proficient": false,
      "modifier": 0
    },
    "Engineering": {
      "ability": "INT",
      "proficient": true,
      "modifier": 2
    },
    "Geology": {
      "ability": "INT",
      "proficient": false,
      "modifier": 0
    },
    "Intimidation": {
      "ability": "CHA",
      "proficient": false,
      "modifier": 0
    },
    "Investigation": {
      "ability": "INT",
      "proficient": false,
      "modifier": 0
    },
    "Medicine": {
      "ability": "WIS",
      "proficient": false,
      "modifier": 0
    },
    "Navigation": {
      "ability": "INT",
      "proficient": false,
      "modifier": 0
    },
    "Perception": {
      "ability": "WIS",
      "proficient": false,
      "modifier": 0
    },
    "Performance": {
      "ability": "CHA",
      "proficient": false,
      "modifier": 0
    },
    "Persuasion": {
      "ability": "CHA",
      "proficient": false,
      "modifier": 0
    },
    "Piloting": {
      "ability": "DEX",
      "proficient": false,
      "modifier": 0
    },
    "Scavenging": {
      "ability": "DEX",
      "proficient": false,
      "modifier": 0
    },
    "Stealth": {
      "ability": "DEX",
      "proficient": false,
      "modifier": 0
    },
    "Survival": {
      "ability": "WIS",
      "proficient": false,
      "modifier": 0
    },
    "Toxicology": {
      "ability": "INT",
      "proficient": false,
      "modifier": 0
    },
    "Trading": {
      "ability": "INT",
      "proficient": false,
      "modifier": 0
    }
  },
  "equipment": {
    "suit": {
      "environmentalProtection": {
        "cold": 2,
        "heat": 2
      },
      "abilityModifiers": {
        "CON": 2
      },
      "properties": [
        "Insulated"
      ],
      "type": "Medium Armor",
      "baseAC": 13,
      "dexBonus": 2,
      "industrialUse": "Mining and high-temperature work environments"
    },
    "headgear": {
      "type": "Advanced Visor",
      "acBonus": 2,
      "properties": [
        "Hyperspec Optics"
      ],
      "environmentalProtection": {},
      "abilityModifiers": {},
      "industrialUse": "Zero-visibility operations and combat",
      "vision": "Hyperspectral vision (can see in zero-visibility conditions)",
      "warning": "Extended use may cause psychological effects"
    },
    "accessory": {
      "abilityModifiers": {},
      "properties": [
        "Heavy",
        "Two-handed"
      ],
      "damage": "2d6",
      "damageType": "slashing",
      "damageRange": {
        "min": 2,
        "max": 12
      },
      "industrialUse": "Heavy vegetation clearing and wilderness navigation"
    },
    "backpack": {
      "environmentalProtection": {},
      "properties": [
        "Heavy",
        "Waterproof",
        "Structural"
      ],
      "type": "Heavy Industrial",
      "carryingCapacity": 150,
      "special": "Can be used as emergency shelter",
      "industrialUse": "Heavy cargo transport and industrial operations"
    },
    "graphic": {
      "type": "Professional Guild",
      "abilityModifiers": {
        "STR": 1
      },
      "skillProficiencies": [
        "Athletics",
        "Engineering"
      ],
      "factionRelations": {},
      "industrialUse": "Asteroid and EVA mining operations",
      "special": "Advantage on zero-gravity mining checks"
    }
  },
  "carryingCapacity": 150
}
```




3/24/2025
First task will be to continue to flesh out the requirements.

We will start with the core.

Befor we work on core, though, we need to come up with the rules of how the traits convert to rpg stuff.

And before we come up with the rules, we need to scrape the collection's metadata so we can analyze it.

here is a sample url for the collection. this one is for id 2051
https://omniscient.fringedrifters.com/main/metadata/2051.json

Here is the data that comes back

```
{
  "description": "The Fringe is a vast space, untouched by the rule of law. Full of danger. Full of opportunity. We are the DRIFTERS who roam these wild reaches.",
  "image": "https://omniscient.fringedrifters.com/main/images/2051.jpeg",
  "name": "Drifter #2051",
  "attributes": [
    {
      "trait_type": "Graphic",
      "value": "Beshtala Expatriation Roster"
    },
    {
      "trait_type": "Headgear",
      "value": "Hangtooth"
    },
    {
      "trait_type": "Accessory",
      "value": "The (Fat) Koltso"
    },
    {
      "trait_type": "Suit",
      "value": "Smocker"
    },
    {
      "trait_type": "Backpack",
      "value": "Fancypack"
    },
    {
      "trait_type": "Location",
      "value": "The Void"
    },
    {
      "trait_type": "Phase",
      "value": "Phase 2"
    },
    {
      "trait_type": "Totem",
      "value": "White Air Supply Amulet"
    },
    {
      "trait_type": "Suit Accessories",
      "value": "Simple Regulator"
    },
    {
      "trait_type": "Suit Pattern",
      "value": "Sacred Passage"
    },
    {
      "trait_type": "Suit Color",
      "value": "Yellow"
    },
    {
      "trait_type": "Class",
      "value": "Drifter"
    }
  ]
}
```