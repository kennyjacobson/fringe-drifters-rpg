// Very simple home page for the character sheet viewer

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();
  const [drifterId, setDrifterId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Navigate to character sheet
  const viewCharacterSheet = () => {
    if (!drifterId || isNaN(parseInt(drifterId))) {
      setError('Please enter a valid Drifter ID');
      return;
    }
    navigate(`/character-sheet-compact/${drifterId}`);
  };

  // Navigate to battle selector
  const startBattle = () => {
    navigate('/battle-selector');
  };

  // Navigate to alt character sheet
  const viewAltCharacterSheet = () => {
    if (!drifterId || isNaN(parseInt(drifterId))) {
      setError('Please enter a valid Drifter ID');
      return;
    }
    navigate(`/character-sheet-compact-alt/${drifterId}`);
  };

  return (
    <div className="bg-black text-green-400 font-mono p-4 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl mb-2 border-b border-green-700 pb-4 pt-4">FRINGE DRIFTERS RPG TERMINAL</h1>
          <p className="text-sm text-green-600 mb-4">:: SECURE CONNECTION ESTABLISHED ::</p>
          <div className="inline-block border border-green-700 px-4 py-2 bg-green-900/10">
            <span className="animate-pulse">◉</span> SYSTEM READY
          </div>
        </header>

        {error && (
          <div className="border border-red-600 bg-red-900/20 p-2 mb-4 text-red-400 max-w-md mx-auto">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Character Sheet Section */}
          <div className="border border-green-700 p-4">
            <h2 className="text-xl mb-4 border-b border-green-900 pb-2">CHARACTER DATABASE</h2>
            
            <div className="mb-4">
              <label htmlFor="drifterId" className="block mb-2">DRIFTER ID:</label>
              <input
                id="drifterId"
                type="text"
                value={drifterId}
                onChange={(e) => setDrifterId(e.target.value)}
                className="w-full bg-black border border-green-700 px-3 py-2 focus:border-green-500 focus:outline-none text-green-400"
                placeholder="Enter Drifter ID..."
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={viewCharacterSheet}
                className="border border-green-700 bg-green-900/20 hover:bg-green-900/40 px-4 py-3"
              >
                ACCESS CHARACTER SHEET
              </button>
              <button
                onClick={viewAltCharacterSheet}
                className="border border-green-700 bg-green-900/20 hover:bg-green-900/40 px-4 py-3"
              >
                ACCESS ALT CHARACTER SHEET
              </button>
            </div>
          </div>

          {/* Combat System Section */}
          <div className="border border-green-700 p-4">
            <h2 className="text-xl mb-4 border-b border-green-900 pb-2">COMBAT SIMULATOR</h2>
            
            <div className="aspect-video border border-green-900 mb-4 p-2 flex items-center justify-center bg-green-900/10">
              <div className="text-center">
                <div className="text-4xl mb-2">⚔️</div>
                <div>COMBAT SIMULATION READY</div>
              </div>
            </div>

            <button
              onClick={startBattle}
              className="border border-green-700 bg-green-900/20 hover:bg-green-900/40 px-4 py-3 w-full"
            >
              INITIATE BATTLE SEQUENCE
            </button>
          </div>
        </div>

        {/* System Information */}
        <div className="mt-8 border border-green-700 p-4 text-sm">
          <h3 className="mb-2 border-b border-green-900 pb-1">SYSTEM STATUS</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-green-600">DATABASE:</span> ONLINE
            </div>
            <div>
              <span className="text-green-600">COMBAT SYSTEMS:</span> READY
            </div>
            <div>
              <span className="text-green-600">DRIFTERS INDEXED:</span> 8,000+
            </div>
            <div>
              <span className="text-green-600">DATA INTEGRITY:</span> 99.97%
            </div>
          </div>
        </div>

        {/* Random Lore Text */}
        <div className="mt-4 text-green-600 text-xs border-t border-green-900 pt-4">
          <div className="terminal-text">
            <p className="mb-1">&gt; TRANSMISSION FROM EARLIE PRIME INTERCEPTED...</p>
            <p className="mb-1">&gt; PIRATES SPOTTED NEAR THE ROCKY CLOUD. APPROACH WITH CAUTION.</p>
            <p>&gt; SPECIMEN CATALOGING COMPLETE. NEW DISCOVERIES AWAIT.</p>
          </div>
        </div>
      </div>
    </div>
  );
}


