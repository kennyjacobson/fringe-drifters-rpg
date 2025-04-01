import { parseSuits, parseAccessories, parseBackpacks, parseGraphics, parseHeadgear } from './markdownParser';

const testSuitMarkdown = `
# Test Suits

## Implementation Notes
Some notes here...

## Suits

### Gutter Shirt
- Type: Light Armor
- Armor Class: 11 + Dexterity modifier (maximum +3)
- Properties: Durable, Low-cost
- Environmental Protection:
  - Cold: +2
  - Heat: +2
- Ability Modifier: +1 CON
- Industrial Use: Basic protection for general work

### Smocker
- Type: Medium Armor
- Armor Class: 13 + Dexterity modifier (maximum +2)
- Properties: Insulated
- Ability Modifier: +2 CON
- Industrial Use: Mining and high-temperature work environments
`;

console.log(JSON.stringify(parseSuits(testSuitMarkdown), null, 2));

const testAccessoryMarkdown = `
# Test Accessories

## Implementation Notes
Some notes here...

## Accessories

### Thruster
- Damage: 2d8 bludgeoning
- Properties: Heavy, Two-handed
- Industrial Use: Breaking rock and minerals
- Ability Modifier: +2 STR

### The Shriek
- Damage: 1d4 psychic
- Properties: Range (60/120)
- Industrial Use: Communication and signal interception
- Ability Modifier: +1 CHA
- Range: 60/120
`;

console.log('Parsed Accessories:', JSON.stringify(parseAccessories(testAccessoryMarkdown), null, 2));

const testBackpackMarkdown = `
# Test Backpacks

## Implementation Notes
Some notes here...

## Backpacks

### Caddypack
- Type: Heavy Industrial
- Carrying Capacity: +150 lbs
- Properties: Heavy, Waterproof, Structural
- Environmental Protection:
  - Physical: +3
- Special: Can be used as emergency shelter
- Industrial Use: Heavy cargo transport and industrial operations

### Squirrel Pack
- Type: Standard Utility
- Carrying Capacity: +100 lbs
- Properties: Modular, Versatile, Common
- Special: Built-in tarp and breather tube
- Industrial Use: General exploration and utility work
`;

console.log('Parsed Backpacks:', JSON.stringify(parseBackpacks(testBackpackMarkdown), null, 2));

const testGraphicMarkdown = `
# Test Graphics

## Implementation Notes
Some notes here...

## Graphics

### Cove Stalkers
- Type: Mercenary Organization
- Ability Modifier: +1 STR, +1 CHA
- Skill Proficiencies:
  - Stealth
  - Intimidation
- Faction Relations:
  - Round Power: Hostile
  - Dugall Freight: Neutral
- Industrial Use: Combat and security operations

### Engineers Guild
- Type: Professional Guild
- Ability Modifier: +1 INT
- Skill Proficiencies:
  - Engineering
  - Investigation
- Faction Relations:
  - Round Power: Unfriendly
  - Dugall Freight: Friendly
- Industrial Use: Engineering operations and freight work
`;

console.log('Parsed Graphics:', JSON.stringify(parseGraphics(testGraphicMarkdown), null, 2));

const testHeadgearMarkdown = `
# Test Headgear

## Implementation Notes
Some notes here...

## Headgear

### BC Shiner
- Type: Premium Visor
- AC Bonus: +1
- Properties: Premium Crystal, Integrated Rebreather
- Environmental Protection:
  - Toxin: +2
- Vision: Enhanced clarity in all conditions
- Ability Modifier: +1 WIS
- Industrial Use: Professional operations and long-haul missions

### Boxhead
- Type: Advanced Visor
- AC Bonus: +2
- Properties: Hyperspec Optics
- Vision: Hyperspectral vision (can see in zero-visibility conditions)
- Warning: Extended use may cause psychological effects
- Industrial Use: Zero-visibility operations and combat
`;

console.log('Parsed Headgear:', JSON.stringify(parseHeadgear(testHeadgearMarkdown), null, 2));  