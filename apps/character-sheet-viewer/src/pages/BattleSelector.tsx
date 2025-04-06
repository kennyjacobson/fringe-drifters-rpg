import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeButton } from "../components/HomeButton.js";

export function BattleSelector() {
  const navigate = useNavigate();
  const [drifter1Id, setDrifter1Id] = useState<string>('1');
  const [drifter2Id, setDrifter2Id] = useState<string>('2');
  const [error, setError] = useState<string | null>(null);

  const startBattle = () => {
    // Validate inputs
    if (!drifter1Id || !drifter2Id) {
      setError('Both Drifter IDs are required');
      return;
    }

    if (drifter1Id === drifter2Id) {
      setError('Drifters cannot battle themselves');
      return;
    }

    // Navigate to battle page with both drifter IDs
    navigate(`/battle-game?drifter1=${drifter1Id}&drifter2=${drifter2Id}`);
  };

  return (
    <div className="bg-black text-green-400 font-mono p-4 min-h-screen">
      <div className="flex justify-between items-center mb-4 border-b border-green-700 pb-2">
        <h1 className="text-xl">FRINGE COMBAT SIMULATOR :: COMBATANT SELECTION</h1>
        <HomeButton />
      </div>
      
      <div className="border border-green-700 p-4 max-w-md mx-auto">
        <h2 className="text-lg mb-4 text-center">SELECT DRIFTERS FOR COMBAT</h2>
        
        {error && (
          <div className="border border-red-600 bg-red-900/20 p-2 mb-4 text-red-400">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label htmlFor="drifter1" className="block mb-2 text-sm">DRIFTER #1 ID:</label>
            <input
              id="drifter1"
              type="text"
              value={drifter1Id}
              onChange={(e) => setDrifter1Id(e.target.value)}
              className="w-full bg-black border border-green-700 px-3 py-2 focus:border-green-500 focus:outline-none text-green-400"
            />
          </div>
          
          <div>
            <label htmlFor="drifter2" className="block mb-2 text-sm">DRIFTER #2 ID:</label>
            <input
              id="drifter2"
              type="text"
              value={drifter2Id}
              onChange={(e) => setDrifter2Id(e.target.value)}
              className="w-full bg-black border border-green-700 px-3 py-2 focus:border-green-500 focus:outline-none text-green-400"
            />
          </div>
          
          <button
            onClick={startBattle}
            className="w-full border border-green-700 bg-green-900/20 hover:bg-green-900/40 px-4 py-2 mt-4"
          >
            INITIATE COMBAT
          </button>
        </div>
      </div>
    </div>
  );
}
