# Fringe RPG Project Summary

## Project Concept
Creating an RPG system that sits on top of The Fringe NFT collection (Fringe Drifters) on the Ethereum blockchain. The system will transform NFT traits into functional RPG attributes similar to D&D, allowing developers to build games using these character sheets.

## Example
- An NFT with the "Hangtooth" headgear trait might translate to "+2 AC" in game terms
- An accessory like "The (Fat) Koltso" could become a weapon that does 4-16 damage (4d4)

## Technical Approach

### Core Architecture
- Building an open-source API/library that converts Fringe NFT traits to RPG attributes
- Using a monorepo structure (with Turborepo) to organize multiple packages
- Focusing on reusable components that can be integrated into various game implementations

### Repository Structure
```
fringe-rpg/
├── packages/
│   ├── fringe-core/       # Core trait-to-attribute conversion logic
│   ├── fringe-api/        # API implementation
│   ├── fringe-react/      # React components for displaying character sheets
├── apps/                  # Example implementations and games
│   ├── example-api/       # Reference API implementation
│   ├── example-web/       # Reference web viewer
```

### Implementation Plan
1. **Data Collection Phase**
   - Create utilities to fetch and analyze all possible Fringe NFT traits
   - Build a comprehensive catalog of trait types and their values
   - Analyze rarity/frequency to inform game balance

2. **Character Sheet Definition**
   - Define standard RPG attributes (STR, DEX, CON, etc.)
   - Map traits to these attributes systematically
   - Create JSON mapping files to drive the conversion system

3. **API/Library Development**
   - Implement core conversion logic
   - Build caching mechanisms for NFT metadata
   - Create standard interfaces for game developers

4. **Example Implementations**
   - Build reference applications showing how to use the system
   - Demonstrate potential game mechanics (card battles, dungeon crawls, etc.)

### Technical Decisions
- Using TypeScript for type safety across the project
- Directly fetching NFT metadata from URLs (no blockchain interaction needed)
- Implementing caching for performance
- Making the system open source and modular for community adoption

The ultimate goal is to create a foundation that enables multiple game implementations using the Fringe NFTs as playable characters, adding utility and value to the NFT collection.