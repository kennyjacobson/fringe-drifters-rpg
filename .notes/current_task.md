# Story Game System Notes

## Core Components
- Uses Ink scripting language for interactive fiction
- Stories are compiled from .ink to .json
- Multiple story modules can be loaded and transitioned between
- Current modules: 'main' and 'the_bench'

## State Management
- Story state is saved per Drifter ID in localStorage
- Format: `story-state-${drifterId}`
- Saves both current module and all story variables
- State persists between sessions

## Story Module Structure
- Each module needs an entry point
- Choices use `+` for sticky/repeatable options
- Use `-> knot_name` for navigation
- Use tags (like `# location: the_bench`) for metadata
- Use `# transition_to_X` tags for module switching

## Critical Flow Points
1. Story transitions must:
   - Save state before transition
   - Load correct module
   - Restore relevant state

2. Choice handling must:
   - Continue story properly
   - Check for transitions
   - Save state after changes

## Integration Points
- Drifter ID from URL params
- Character data integration (planned)
- Equipment system integration (planned)

## Key Technical Details
- Uses inkjs library
- React Router for navigation
- Tailwind for styling (cyberpunk theme)
- All UI elements maintain green-on-black terminal aesthetic

## In a new session, we could focus on:
- Loading and displaying character data
- Integrating equipment into the story
- Adding character stats influence to the story