import React, { useState, useEffect } from 'react';
import { Story } from 'inkjs';
import { useParams } from 'react-router-dom';
import mainStory from '../stories/main.ink.json' with { type: 'json' };
import theBenchStory from '../stories/locations/the_bench.ink.json' with { type: 'json' };
import { HomeButton } from '../components/HomeButton.js';
import { getDrifter } from '@fringe-rpg/core';
import type { CharacterData } from '../types/character.js';

interface StoryContent {
  text: string;
  choices: {
    text: string;
    index: number;
  }[];
  tags: string[];
}

type StoryModule = 'main' | 'the_bench';

interface StoryState {
  currentModule: StoryModule;
  variables: Record<string, any>;
}

// Add this type near the top with the other interfaces
type EquipmentSlot = 'suit' | 'headgear' | 'accessory' | 'backpack' | 'graphic';

type AbilityScore = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';
type SkillName = 
  | 'acrobatics'
  | 'athletics'
  | 'deception'
  | 'engineering'
  | 'geology'
  | 'intimidation'
  | 'investigation'
  | 'medicine'
  | 'navigation'
  | 'perception'
  | 'performance'
  | 'persuasion'
  | 'piloting'
  | 'scavenging'
  | 'stealth'
  | 'survival'
  | 'toxicology'
  | 'trading';

export function StoryGame() {
  const { drifterId } = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [currentStoryModule, setCurrentStoryModule] = useState<StoryModule>('main');
  const [currentContent, setCurrentContent] = useState<StoryContent>({
    text: '',
    choices: [],
    tags: []
  });
  const [characterData, setCharacterData] = useState<CharacterData | null>(null);
  const [characterError, setCharacterError] = useState<Error | null>(null);

  // Load story state from local storage
  const loadStoryState = (): StoryState | null => {
    const saved = localStorage.getItem(`story-state-${drifterId}`);
    return saved ? JSON.parse(saved) : null;
  };

  // Save story state to local storage
  const saveStoryState = (module: StoryModule, variables: Record<string, any>) => {
    const state: StoryState = {
      currentModule: module,
      variables: variables
    };
    localStorage.setItem(`story-state-${drifterId}`, JSON.stringify(state));
  };

  // Load a specific story module
  const loadStoryModule = (module: StoryModule, char: CharacterData) => {
    console.log('loadStoryModule called with', module);
    const storyContent = module === 'main' ? mainStory : theBenchStory;
    const story = new Story(storyContent);
    console.log('Story created');

    // Bind external functions FIRST
    story.BindExternalFunction("checkSkill", (skillName: SkillName): number => {
      if (!char?.skills[skillName]) return 0;
      return char.skills[skillName].modifier;
    });

    story.BindExternalFunction("hasEquipment", (slot: EquipmentSlot, itemName: string): boolean => {
      console.log('hasEquipment', slot, itemName);
      if (itemName === "any") {
        return char?.equipment[slot] !== null;
      }
      return char?.equipment[slot] !== null;
    });

    story.BindExternalFunction("getAbilityScore", (ability: AbilityScore): number => {
      if (!char?.abilityScores[ability]) return 0;
      return char.abilityScores[ability];
    });

    story.BindExternalFunction("getEquipmentName", (slot: EquipmentSlot): string => {
      console.log('getEquipmentName', slot);
      console.log('char?.equipment[slot]', char?.equipment[slot]);
      if (!char?.equipment[slot]) return "None";
      return char.equipment[slot]?.name || "None";
    });

    // Load saved state if it exists
    const savedState = loadStoryState();
    if (savedState && savedState.currentModule === module) {
      Object.entries(savedState.variables).forEach(([key, value]) => {
        // Only set variables that exist in the story
        if (story.variablesState.hasOwnProperty(key)) {
          story.variablesState[key] = value;
        }
      });
    }
    
    setStory(story);
    console.log('Story state set');

    // Continue the story
    let text = '';
    while (story.canContinue) {
      text += story.Continue() + '\n';
    }
    console.log('Story continued, text:', text);

    setCurrentStoryModule(module);
    setCurrentContent({
      text,
      choices: story.currentChoices,
      tags: story.currentTags
    });

    // Save current state
    saveStoryState(module, story.variablesState);
  };

  useEffect(() => {
    if (!drifterId) return;
    
    console.log('Effect running with drifterId:', drifterId);
    try {
      const drifterIdInt = parseInt(drifterId);
      const character = getDrifter(drifterIdInt);
      console.log('Character loaded:', character);
      setCharacterData(character as CharacterData);
      loadStoryModule('main', character as CharacterData);
    } catch (err) {
      console.error('Error in effect:', err);
      setCharacterError(err instanceof Error ? err : new Error('Failed to load character'));
    }
  }, [drifterId]);

  const handleChoice = (index: number) => {
    if (!story || !characterData) return;

    story.ChooseChoiceIndex(index);
    
    // Get next content
    let text = '';
    while (story.canContinue) {
      text += story.Continue() + '\n';
    }

    // Check if we need to transition to a different story module
    const tags = story.currentTags;
    if (tags.includes('transition_to_bench')) {
      loadStoryModule('the_bench', characterData);
      return;
    }
    if (tags.includes('transition_to_main')) {
      loadStoryModule('main', characterData);
      return;
    }

    setCurrentContent({
      text,
      choices: story.currentChoices,
      tags: story.currentTags
    });

    // Save state after each choice
    saveStoryState(currentStoryModule, story.variablesState);
  };

  if (!story) return <div>Loading...</div>;

  return (
    <div className="bg-black text-green-400 font-mono p-4 min-h-screen">
      <div className="flex justify-between items-center mb-4 border-b border-green-700 pb-2">
        <div>
          <h1 className="text-xl">FRINGE DRIFTER :: STORY MODE</h1>
          <div className="text-sm text-green-600">Drifter ID: {drifterId}</div>
        </div>
        <div className="flex gap-4">
          
          <HomeButton />
        </div>
      </div>

      {/* Story text */}
      <div className="mb-4 whitespace-pre-wrap border border-green-700 p-4 min-h-[200px]">
        {currentContent.text}
      </div>

      {/* Choices */}
      <div className="space-y-2">
        {currentContent.choices.map((choice, index) => (
          <button
            key={index}
            onClick={() => handleChoice(index)}
            className="border border-green-700 px-4 py-2 bg-green-900/20 
                     hover:bg-green-900/40 w-full text-left"
          >
            {choice.text}
          </button>
        ))}
      </div>

      {/* Location info from tags */}
      {currentContent.tags.length > 0 && (
        <div className="mt-4 text-xs text-green-600 border-t border-green-900 pt-2">
          {currentContent.tags.map((tag, index) => (
            <div key={index}>{tag}</div>
          ))}
        </div>
      )}

      {/* Character Stats Panel */}
      {characterData && (
        <div className="mt-4 text-xs text-green-600 border-t border-green-900 pt-2">
          <div className="grid grid-cols-6 gap-2">
            {Object.entries(characterData.abilityScores).map(([ability, score]) => (
              <div key={ability} className="text-center">
                <div className="font-bold">{ability.toUpperCase()}</div>
                <div>{score}</div>
              </div>
            ))}
          </div>
          <div className="mt-2">
            AC: {characterData.baseAC} | Equipment: {characterData.equipment.suit?.name || 'None'}
          </div>
        </div>
      )}

      {/* Debug info */}
      <div className="mt-4 text-xs text-green-600 border-t border-green-900 pt-2">
        Current Module: {currentStoryModule}
      </div>
    </div>
  );
}