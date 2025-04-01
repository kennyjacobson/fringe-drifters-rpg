# Fringe Drifter Suits

## Implementation Notes
When calculating a character's damage and armour class:
1. Check if character has a Mech Suit equipped
   - If YES: Use Mech Suit's damage and ignore standard accessory slot
   - If NO: Use standard accessory slot's damage
2. For Armor Class:
   - Mech Suits override both standard armor and accessory bonuses
   - Standard equipment uses normal armor + accessory calculations

## Suits

### Gutter Shirt
- Type: Light Armor
- Armor Class: 11 + Dexterity modifier (maximum +3)
- Properties: Durable, Low-cost
- Environmental Protection: None
- Ability Modifier: +1 CON
- Industrial Use: Basic protection for general work

### Smocker
- Type: Medium Armor
- Armor Class: 13 + Dexterity modifier (maximum +2)
- Properties: Insulated
- Environmental Protection: 
  - Cold: +2
  - Heat: +2
- Ability Modifier: +2 CON
- Industrial Use: Mining and high-temperature work environments

### Kreegal Cloak
- Type: Light Armor
- Armor Class: 12 + Dexterity modifier (maximum +3)
- Properties: Weather-Resistant, Breathable
- Environmental Protection:
  - Water: +3
  - Heat: +2
  - Pressure: +1
- Ability Modifier: +1 WIS
- Special: Advantage on Survival checks in humid environments
- Industrial Use: Research expeditions and Grove exploration

### Grounder Pounder
- Type: Heavy Armor
- Armor Class: 16 + Dexterity modifier (maximum +1)
- Properties: Heavy, Impact Resistant
- Environmental Protection:
  - Seismic: +5
- Ability Modifier: +2 CON
- Special: Immunity to C-KAFS (close-quarter fluid snaps) damage
- Industrial Use: Combat and hazardous mining operations

### Vayon Worksuit
- Type: Light Armor
- Armor Class: 12 + Dexterity modifier (maximum +3)
- Properties: Temperature Regulated
- Environmental Protection:
  - Heat: +2
  - Toxin: +2
- Industrial Use: Edical plant operations and particle exposure environments

### Deverin Jacket
- Type: Light Armor
- Armor Class: 11 + Dexterity modifier (maximum +3)
- Properties: Lightweight, Versatile
- Environmental Protection:
  - Toxin: +2
  - Particulate: +3
- Special: Can be worn in both outdoor and enclosed environments without penalty
- Industrial Use: Corporate operations and rig work

### Pitchfork Prongshell
- Type: Light Armor
- Armor Class: 12 + Dexterity modifier (maximum +3)
- Properties: Light, Dextrous
- Environmental Protection: None
- Ability Modifier: +1 DEX
- Industrial Use: Agricultural work and light combat

### Prongshell
- Type: Medium Armor
- Armor Class: 14 + Dexterity modifier (maximum +2)
- Properties: Insulated, Enhanced Vision
- Environmental Protection:
  - Cold: +5
  - Toxin: +3
- Special: Grants darkvision in pure darkness
- Industrial Use: Jelly mining and extreme environment operations

### Duggie
- Type: Light Armor
- Armor Class: 12 + Dexterity modifier (maximum +3)
- Properties: Standard Issue, Corporate
- Environmental Protection:
  - Heat: +1
  - Cold: +1
- Industrial Use: General freight and corporate operations

### Platemail
- Type: Heavy Armor
- Armor Class: 17 + Dexterity modifier (maximum +1)
- Properties: Heavy, Noisy
- Environmental Protection:
  - Physical: +3
- Special: Disadvantage on Stealth checks due to clacking sound
- Industrial Use: Combat operations

### Fursuit
- Type: Medium Armor
- Armor Class: 14 + Dexterity modifier (maximum +2)
- Properties: Prestigious, Durable
- Environmental Protection:
  - Cold: +5
- Skill Bonuses: 
  - Survival: +1
  - Intimidation: +1
- Industrial Use: Cold environment operations

### Satchel
- Type: Light Armor
- Armor Class: 12 + Dexterity modifier (maximum +3)
- Properties: Light, Versatile, Storage
- Environmental Protection: None
- Special: Additional storage slots for quick-access items
- Skill Bonus:
  - Athletics: +1
- Industrial Use: General combat and exploration
