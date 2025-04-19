import React, { useState, useEffect } from 'react';
import { Story } from 'inkjs';
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

export function StoryGame() {
  const [story, setStory] = useState<Story | null>(null);
  const [currentStoryModule, setCurrentStoryModule] = useState<StoryModule>('main');
  const [currentContent, setCurrentContent] = useState<StoryContent>({
    text: '',
    choices: [],
    tags: []
  });

  // Load a specific story module
  const loadStoryModule = (module: StoryModule) => {
    const storyContent = module === 'main' ? mainStory : theBenchStory;
    console.log('Loading module:', module);
    console.log('Story content:', storyContent);
    const story = new Story(storyContent);
    console.log('Story created:', story);
    
    // Try multiple continues
    console.log('First continue...');
    let text = story.Continue();
    console.log('Text after first continue:', text);
    console.log('Can continue?', story.canContinue);
    
    if (story.canContinue) {
        console.log('Second continue...');
        text = story.Continue();
        console.log('Text after second continue:', text);
    }

    setStory(story);
    setCurrentStoryModule(module);
    
    setCurrentContent({
        text,
        choices: story.currentChoices,
        tags: story.currentTags
    });

    console.log('Loading module:', module);
    console.log('Story content:', storyContent);
  };

  useEffect(() => {
    // Initialize with main story
    loadStoryModule('main');
    console.log('Initializing story');
  }, []);

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
    // Add this check for transitioning back to main
    if (tags.includes('transition_to_main')) {
      loadStoryModule('main');
      return;
    }

    setCurrentContent({
      text,
      choices: story.currentChoices,
      tags: story.currentTags
    });

    console.log('Choice made:', index);
    console.log('Next text:', text);
    console.log('Current tags:', tags);
    console.log('Current choices:', story.currentChoices);
  };

  if (!story) return <div>Loading...</div>;

  return (
    <div className="bg-black text-green-400 font-mono p-4 min-h-screen">
      <div className="flex justify-between items-center mb-4 border-b border-green-700 pb-2">
        <h1 className="text-xl">FRINGE DRIFTER :: STORY MODE</h1>
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