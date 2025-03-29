# Fringe Drifters Accessories

## Implementation Notes
When calculating a character's weapon damage:
1. Check if character has a Mech Suit equipped
   - If YES: Use Mech Suit's damage and ignore standard accessory slot
   - If NO: Use standard accessory slot's damage
2. For Armor Class:
   - Mech Suits override both standard armor and accessory bonuses
   - Standard equipment uses normal armor + accessory calculations

## Format
Each accessory is documented with:
- Damage: [dice] [type]
- Properties: [heavy/light/etc]
- Industrial Use: [primary non-combat function]
- Ability Modifier: [STR/CHA/CON/etc]

## Progress Tracker
Total accessories to document: 55
Completed: 32

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

### Round Foot
- Damage: 1d10 bludgeoning
- Properties: Heavy
- Industrial Use: Ground compacting and material processing
- Ability Modifier: +1 STR

### The Spunker
- Damage: 1d8 piercing
- Properties: Versatile
- Industrial Use: Soil sampling and mineral detection

### Hull Breacher
- Damage: 1d6 piercing
- Properties: Light, Finesse, Special
- Industrial Use: Rock sampling and mineral vein exploration
- Ability Modifier: +1 DEX

### Chainflicker
- Damage: 2d6 slashing
- Properties: Heavy, Two-handed
- Industrial Use: Logging and timber processing

### Wedge
- Damage: 1d6 bludgeoning
- Properties: Versatile (1d8)
- Industrial Use: Digging and soil excavation

### Death Beam
- Damage: 4d8 force
- Properties: Heavy, Two-handed, Loading, Special
- Industrial Use: Industrial cutting and hull penetration
- Ability Modifier: +1 INT (Complex weapon operation)

### Reef Sweeper
- Damage: 1d8 slashing
- Properties: Finesse, Light
- Industrial Use: Vegetation clearing and utility cutting

### Seam Ripper
- Damage: 1d10 piercing
- Properties: Heavy, Loading
- Industrial Use: Rock drilling and core sampling

### Fat Koltso
- Damage: 2d10 piercing
- Properties: Heavy, Two-handed, Loading, Range (80/320), Special
- Industrial Use: Hull penetration and structural demolition

### Everdull Snippies
- Damage: 2d6 slashing
- Properties: Heavy, Loading
- Industrial Use: Metal shearing and broemite processing

### Ball Claw
- Damage: 1d6 bludgeoning + 2d6 crushing on grapple
- Properties: Special (On hit, can attempt to grapple. While grappling, deals crushing damage), Reach
- Industrial Use: Resource harvesting and material extraction
- Ability Modifier: +1 STR

### The Slipper
- Damage: 1d8 slashing
- Properties: Finesse, Light, Special
- Industrial Use: Path clearing and vegetation management

### The Koltso
- Damage: 2d8 piercing
- Properties: Heavy, Two-handed, Loading, Range (60/240)
- Industrial Use: Rock bolt driving and mining operations

### Trunker
- Damage: 2d6 slashing
- Properties: Heavy, Two-handed
- Industrial Use: Heavy vegetation clearing and wilderness navigation

### Hole Puncher
- Damage: 1d10 piercing
- Properties: Light, Loading, Range (30/90)
- Industrial Use: Precision mining and vein extraction

### The Nozzle
- Damage: 2d4 acid
- Properties: Special (Can use different damage types based on loaded substance), Range (20/60)
- Industrial Use: Chemical application and medical treatment
- Ability Modifier: +1 INT (Chemical knowledge required)

### Steady Hammer
- Damage: 1d10 bludgeoning
- Properties: Heavy, Special (Negates vibration damage to user)
- Industrial Use: Construction and stonework
- Ability Modifier: +1 CON (Vibration resistance)

### Cream Steamer
- Damage: 2d6 fire + 1d4 acid
- Properties: Loading, Special (Creates lingering fire damage in target area)
- Industrial Use: Chemical dispersal and industrial cleaning

### Flocker
- Damage: 1d4 bludgeoning
- Properties: Special (Can entangle targets), Range (30/60)
- Industrial Use: Pest control and specimen collection

### Candlestick
- Damage: 1d8 (varies by ammunition)
- Properties: Loading, Special (Can use different ammunition types)
- Industrial Use: Emergency signaling and illumination

### Soaker
- Damage: 2d4 acid
- Properties: Special (Causes ongoing acid damage), Range (15/30)
- Industrial Use: Chemical application and surface treatment

### Soapy
- Damage: 1d10 piercing
- Properties: Loading, Quiet
- Industrial Use: Precision hunting and specimen collection

### Bolt Harp
- Damage: 1d8 piercing
- Properties: Loading, Range (60/120), Special (6-shot cylinder with rapid fire capability)
- Industrial Use: Hunting and game collection

### Cove Carver
- Damage: 2d6 piercing
- Properties: Loading, Range (40/120), Special (Can recharge spent ammunition for low-power shots)
- Industrial Use: Security and defense operations

### Faulk's Icepick
- Damage: 2d10 piercing
- Properties: Heavy, Loading, Range (150/600)
- Industrial Use: Long-range specimen collection and large game hunting
- Ability Modifier: +1 WIS (Long-range precision)

### Roulette
- Damage: 1d8 (varies by ammunition)
- Properties: Loading, Special (Can sequence different ammunition types)
- Industrial Use: Multi-purpose signaling and emergency response

### Hull Hooker
- Damage: 1d6 piercing
- Properties: Special (Can grapple to surfaces), Reach
- Industrial Use: Ship maintenance and hull repair

### Prongseat
- Damage: 2d8 force
- Properties: Heavy, Special (Vehicle mount, can be used for aerial maneuvers)
- Industrial Use: Reconnaissance and emergency response operations
- Ability Modifier: +1 DEX (Aerial maneuvering)

### Heavy Spigot
- Damage: 2d8 slashing
- Properties: Heavy, Two-handed, Special (Execution-style attacks)
- Industrial Use: Heavy material processing and demolition

### Straight Smile
- Damage: 1d10 slashing
- Properties: Finesse, Special (Serrated blade causes additional bleeding damage)
- Industrial Use: Material cutting and precision shearing
- Ability Modifier: +1 DEX (Finesse weapon mastery)

## Mech Suits
Mech suits provide both offensive capabilities and defensive protection. These suits replace both the standard armor and accessory slots for a character.

### Hand Cannon Mech
- Damage: 4d10 force
- Properties: Heavy, Loading, Range (80/240), Special (Can disintegrate targets on critical hits)
- Armor Class: 16
- Industrial Use: Rock demolition and long-range mining operations
- Ability Modifiers: +2 STR, +1 CON

### Vice Grip Mech
- Damage: 2d12 bludgeoning + 2d8 crushing
- Properties: Heavy, Special (Can grapple targets, dealing automatic crushing damage while grappled)
- Armor Class: 17
- Industrial Use: Ore crushing and heavy material manipulation
- Ability Modifiers: +3 STR, +1 CON

### Bore Master Mech
- Damage: 3d6 piercing
- Properties: Heavy, Special (Can drill through solid materials)
- Armor Class: 15
- Industrial Use: Mining operations and tunnel boring
- Ability Modifiers: +2 STR, +1 INT