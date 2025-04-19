import React, { useState, useEffect } from 'react';
import { Story } from 'inkjs';
import { useParams } from 'react-router-dom';
import mainStory from '../stories/main.ink.json' with { type: 'json' };
import theBenchStory from '../stories/locations/the_bench.ink.json' with { type: 'json' };
import { HomeButton } from '../components/HomeButton.js';

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

export function StoryGame() {
  const { drifterId } = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [currentStoryModule, setCurrentStoryModule] = useState<StoryModule>('main');
  const [currentContent, setCurrentContent] = useState<StoryContent>({
    text: '',
    choices: [],
    tags: []
  });

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
  const loadStoryModule = (module: StoryModule) => {
    const storyContent = module === 'main' ? mainStory : theBenchStory;
    console.log('Loading module:', module);
    const story = new Story(storyContent);

    // Load saved state if it exists
    const savedState = loadStoryState();
    if (savedState && savedState.currentModule === module) {
      Object.entries(savedState.variables).forEach(([key, value]) => {
        story.variablesState[key] = value;
      });
    }
    
    // Try multiple continues
    let text = story.Continue();
    if (story.canContinue) {
      text = story.Continue();
    }

    setStory(story);
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
    // Initialize with main story
    loadStoryModule('main');
  }, [drifterId]); // Reload when drifterId changes

  const handleChoice = (index: number) => {
    if (!story) return;

    story.ChooseChoiceIndex(index);
    
    // Get next content
    const text = story.Continue();

    // Check if we need to transition to a different story module
    const tags = story.currentTags;
    if (tags.includes('transition_to_bench')) {
      loadStoryModule('the_bench');
      return;
    }
    if (tags.includes('transition_to_main')) {
      loadStoryModule('main');
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
          <button 
            onClick={() => loadStoryModule('main')}
            className="border border-green-700 px-3 py-1 text-sm bg-green-900/20 hover:bg-green-900/40"
          >
            [MAIN HUB]
          </button>
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

      {/* Debug info */}
      <div className="mt-4 text-xs text-green-600 border-t border-green-900 pt-2">
        Current Module: {currentStoryModule}
      </div>
    </div>
  );
}