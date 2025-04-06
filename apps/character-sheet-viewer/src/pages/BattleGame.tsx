import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getDrifter } from '@fringe-rpg/core';
// import { Badge } from "../components/ui/badge.js";
import { HomeButton } from "../components/HomeButton.js";

// Type definitions from CharacterSheetCompact
interface CharacterData {
  abilityScores: Record<string, number>;
  baseAC: number;
  resistances: Record<string, number>;
  skills: Record<string, {
    ability: string;
    proficient: boolean;
    modifier: number;
  }>;
  equipment: {
    suit: EquipmentItem | null;
    headgear: EquipmentItem | null;
    accessory: EquipmentItem | null;
    backpack: EquipmentItem | null;
    graphic: EquipmentItem | null;
  };
  carryingCapacity: number;
}

interface EquipmentItem {
  name: string;
  type: string;
  properties?: string[];
  damage?: string; 
  damageRange?: {
    min: number;
    max: number;
  };
  industrialUse?: string;
  special?: string;
  warning?: string;
  vision?: string;
  environmentalProtection?: Record<string, number>;
  abilityModifiers?: Record<string, number>;
  acBonus?: number;
  baseAC?: number;
  dexBonus?: number;
  skillProficiencies?: string[];
  factionRelations?: Record<string, string>;
  carryingCapacity?: number;
  damageType?: string;
  range?: string;
}

interface CombatLog {
  message: string;
  type: 'attack' | 'damage' | 'miss' | 'heal' | 'effect' | 'info';
  turn: number;
}

export function BattleGame() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get drifter IDs from URL params
  const drifter1Id = searchParams.get('drifter1') || '1';
  const drifter2Id = searchParams.get('drifter2') || '2';
  
  const [drifter1, setDrifter1] = useState<CharacterData | null>(null);
  const [drifter2, setDrifter2] = useState<CharacterData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Combat state
  const [turn, setTurn] = useState<number>(1);
  const [activePlayer, setActivePlayer] = useState<number>(1); // 1 or 2
  const [combatLog, setCombatLog] = useState<CombatLog[]>([]);
  const [hp1, setHp1] = useState<number>(20); // Default starting HP
  const [hp2, setHp2] = useState<number>(20);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<number | null>(null);
  
  // Combat animation state
  const [showAttackAnimation, setShowAttackAnimation] = useState<boolean>(false);
  const [attackDirection, setAttackDirection] = useState<'left' | 'right'>('right');
  
  // Load drifter data
  useEffect(() => {
    const fetchDrifters = async () => {
      try {
        setLoading(true);
        const d1 = getDrifter(parseInt(drifter1Id) || 1);
        const d2 = getDrifter(parseInt(drifter2Id) || 2);
        
        setDrifter1(d1 as CharacterData);
        setDrifter2(d2 as CharacterData);
        
        // Set initial HP based on CON scores - this is simplified
        const con1 = d1.abilityScores['CON'] ?? 10;
        const con2 = d2.abilityScores['CON'] ?? 10;
        
        setHp1(10 + Math.floor((con1 - 10) / 2));
        setHp2(10 + Math.floor((con2 - 10) / 2));
        
        // Add initial combat log entry
        setCombatLog([{
          message: `BATTLE INITIATED: DRIFTER #${drifter1Id} VS DRIFTER #${drifter2Id}`,
          type: 'info',
          turn: 0
        }]);
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load drifters'));
        setLoading(false);
      }
    };
    
    fetchDrifters();
  }, [drifter1Id, drifter2Id]);
  
  // Function to roll dice (e.g. "2d6" => roll 2 six-sided dice)
  const rollDice = (diceNotation: string = "1d4"): number => {
    if (!diceNotation) return 0;
    
    const match = diceNotation.match(/(\d+)d(\d+)/);
    if (!match) return 0;
    
    const numDice = parseInt(match[1] ?? "1");
    const dieSize = parseInt(match[2] ?? "4");
    let total = 0;
    
    for (let i = 0; i < numDice; i++) {
      total += Math.floor(Math.random() * dieSize) + 1;
    }
    
    return total;
  };
  
  // Perform attack
  const performAttack = () => {
    if (!drifter1 || !drifter2 || gameOver) return;
    
    const attacker = activePlayer === 1 ? drifter1 : drifter2;
    const defender = activePlayer === 1 ? drifter2 : drifter1;
    const attackerName = `DRIFTER #${activePlayer === 1 ? drifter1Id : drifter2Id}`;
    const defenderName = `DRIFTER #${activePlayer === 1 ? drifter2Id : drifter1Id}`;
    
    // Calculate attack bonus (STR mod for melee or DEX mod for ranged)
    const strMod = Math.floor(((attacker.abilityScores['STR'] ?? 10) - 10) / 2);
    const dexMod = Math.floor(((attacker.abilityScores['DEX'] ?? 10) - 10) / 2);
    
    // Determine if weapon is ranged
    const isRanged = attacker.equipment.accessory?.range ? true : false;
    const attackBonus = isRanged ? dexMod : strMod;
    
    // Roll attack (d20 + attack bonus)
    const attackRoll = Math.floor(Math.random() * 20) + 1 + attackBonus;
    const targetAC = defender.baseAC;
    
    // Set animation direction
    setAttackDirection(activePlayer === 1 ? 'right' : 'left');
    setShowAttackAnimation(true);
    
    // Reset animation after 500ms
    setTimeout(() => {
      setShowAttackAnimation(false);
      
      // Add attack log
      let newLog: CombatLog;
      
      if (attackRoll >= targetAC) {
        // Hit! Calculate damage
        let damageRoll = 0;
        
        // Use weapon damage or default to 1d4
        const damageDice = attacker.equipment.accessory?.damage ?? "1d4";
        damageRoll = rollDice(damageDice);
        
        // Add strength modifier to damage for melee weapons
        if (!isRanged && strMod > 0) {
          damageRoll += strMod;
        }
        
        // Ensure minimum 1 damage
        damageRoll = Math.max(1, damageRoll);
        
        // Apply damage
        if (activePlayer === 1) {
          setHp2(prev => {
            const newHp = Math.max(0, prev - damageRoll);
            if (newHp <= 0) {
              setGameOver(true);
              setWinner(1);
            }
            return newHp;
          });
        } else {
          setHp1(prev => {
            const newHp = Math.max(0, prev - damageRoll);
            if (newHp <= 0) {
              setGameOver(true);
              setWinner(2);
            }
            return newHp;
          });
        }
        
        newLog = {
          message: `${attackerName} HITS ${defenderName} (${attackRoll} vs AC ${targetAC}) FOR ${damageRoll} DAMAGE!`,
          type: 'damage',
          turn
        };
      } else {
        // Miss
        newLog = {
          message: `${attackerName} MISSES ${defenderName} (${attackRoll} vs AC ${targetAC})`,
          type: 'miss',
          turn
        };
      }
      
      setCombatLog(prevLog => [newLog, ...prevLog]);
      
      // Switch active player and increment turn if needed
      if (activePlayer === 2) {
        setTurn(prev => prev + 1);
      }
      setActivePlayer(activePlayer === 1 ? 2 : 1);
    }, 500);
  };
  
  // Start a new battle
  const startNewBattle = () => {
    navigate('/battle-selector');
  };
  
  // Error and Loading states
  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }
  
  if (loading) {
    return <div className="p-4 text-gray-400">LOADING COMBAT SYSTEMS...</div>;
  }
  
  // Calculate max HP for health bar display
  const maxHp1 = drifter1 ? (10 + Math.floor(((drifter1.abilityScores['CON'] ?? 10) - 10) / 2)) : 10;
  const maxHp2 = drifter2 ? (10 + Math.floor(((drifter2.abilityScores['CON'] ?? 10) - 10) / 2)) : 10;
  
  return (
    <div className="bg-black text-green-400 font-mono p-4 min-h-screen">
      <div className="flex justify-between items-center mb-4 border-b border-green-700 pb-2">
        <h1 className="text-xl">FRINGE COMBAT SIMULATOR :: ENCOUNTER #{turn}</h1>
        <HomeButton />
      </div>
      
      <div className="grid grid-cols-[1fr_2fr_1fr] gap-4">
        {/* Drifter 1 Stats */}
        <div className={`border border-green-700 p-2 ${activePlayer === 1 ? 'bg-green-900/20' : ''}`}>
          <h2 className="text-lg underline mb-2">DRIFTER #{drifter1Id}</h2>
          
          {/* Health bar */}
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span>HP</span>
              <span>{hp1}</span>
            </div>
            <div className="w-full bg-green-900/30 h-3 border border-green-700">
              <div 
                className="bg-green-600 h-full transition-all duration-300"
                style={{ width: `${(hp1 / maxHp1) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Key combat stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="border border-green-900 p-1 text-center">
              <div className="text-xs">STR</div>
              <div className="text-lg">{drifter1?.abilityScores['STR'] ?? 10}</div>
              <div className="text-xs">
                ({Math.floor(((drifter1?.abilityScores['STR'] ?? 10) - 10) / 2) >= 0 ? '+' : ''}
                {Math.floor(((drifter1?.abilityScores['STR'] ?? 10) - 10) / 2)})
              </div>
            </div>
            <div className="border border-green-900 p-1 text-center">
              <div className="text-xs">DEX</div>
              <div className="text-lg">{drifter1?.abilityScores['DEX'] ?? 10}</div>
              <div className="text-xs">
                ({Math.floor(((drifter1?.abilityScores['DEX'] ?? 10) - 10) / 2) >= 0 ? '+' : ''}
                {Math.floor(((drifter1?.abilityScores['DEX'] ?? 10) - 10) / 2)})
              </div>
            </div>
          </div>
          
          {/* Weapon */}
          <div className="border border-green-900 p-1 mb-4">
            <div className="font-semibold capitalize mb-0.5">
              Weapon: <span className="font-normal">{drifter1?.equipment.accessory?.name || 'Unarmed'}</span>
            </div>
            {drifter1?.equipment.accessory?.damage && (
              <p className="text-xs opacity-80">
                Damage: {drifter1.equipment.accessory.damage} {drifter1.equipment.accessory.damageType || ''}
              </p>
            )}
          </div>
          
          {/* Armor */}
          <div className="border border-green-900 p-1">
            <div className="font-semibold mb-0.5">AC: {drifter1?.baseAC}</div>
            <div className="text-xs opacity-80">
              {drifter1?.equipment.suit?.name || 'No Armor'}
            </div>
          </div>
        </div>
        
        {/* Combat Area */}
        <div className="border border-green-700 p-2 flex flex-col">
          {/* Combat visuals */}
          <div className="h-48 border border-green-900 mb-4 relative flex items-center justify-center">
            {gameOver ? (
              <div className="text-2xl text-center animated-text">
                COMBAT COMPLETE<br />
                DRIFTER #{winner === 1 ? drifter1Id : drifter2Id} VICTORIOUS
              </div>
            ) : (
              <>
                {/* Combat visualization */}
                <div className="flex justify-between w-full px-8 items-center">
                  <div className="w-16 h-16 border border-green-700 bg-green-900/30 text-center flex items-center justify-center">
                    #{drifter1Id}
                  </div>
                  
                  {/* Attack animation */}
                  <div className="relative flex-1 h-16 flex items-center justify-center">
                    {showAttackAnimation && (
                      <div 
                        className={`text-3xl absolute transition-all duration-500 ${
                          attackDirection === 'right' 
                            ? 'animate-attack-right' 
                            : 'animate-attack-left'
                        }`}
                      >
                        {attackDirection === 'right' ? '→' : '←'}
                      </div>
                    )}
                  </div>
                  
                  <div className="w-16 h-16 border border-green-700 bg-green-900/30 text-center flex items-center justify-center">
                    #{drifter2Id}
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Combat log */}
          <div className="flex-1 border border-green-900 p-2 h-64 overflow-y-auto font-mono text-sm">
            <h3 className="sticky top-0 bg-black mb-2 pb-1 border-b border-green-900">COMBAT LOG</h3>
            {combatLog.map((log, index) => (
              <div 
                key={index} 
                className={`mb-1 ${
                  log.type === 'damage' ? 'text-red-400' : 
                  log.type === 'miss' ? 'text-yellow-400' : 
                  log.type === 'heal' ? 'text-green-400' : 
                  'text-blue-400'
                }`}
              >
                <span className="opacity-70">[{log.turn}]</span> {log.message}
              </div>
            ))}
          </div>
          
          {/* Combat controls */}
          <div className="mt-4 flex justify-between">
            {gameOver ? (
              <button 
                onClick={startNewBattle}
                className="border border-green-700 px-4 py-2 bg-green-900/20 hover:bg-green-900/40 w-full text-center"
              >
                NEW BATTLE
              </button>
            ) : (
              <button 
                onClick={performAttack}
                className="border border-green-700 px-4 py-2 bg-green-900/20 hover:bg-green-900/40 w-full text-center"
              >
                {activePlayer === 1 ? `DRIFTER #${drifter1Id} ATTACK` : `DRIFTER #${drifter2Id} ATTACK`}
              </button>
            )}
          </div>
        </div>
        
        {/* Drifter 2 Stats */}
        <div className={`border border-green-700 p-2 ${activePlayer === 2 ? 'bg-green-900/20' : ''}`}>
          <h2 className="text-lg underline mb-2">DRIFTER #{drifter2Id}</h2>
          
          {/* Health bar */}
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span>HP</span>
              <span>{hp2}</span>
            </div>
            <div className="w-full bg-green-900/30 h-3 border border-green-700">
              <div 
                className="bg-green-600 h-full transition-all duration-300"
                style={{ width: `${(hp2 / maxHp2) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Key combat stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="border border-green-900 p-1 text-center">
              <div className="text-xs">STR</div>
              <div className="text-lg">{drifter2?.abilityScores['STR'] ?? 10}</div>
              <div className="text-xs">
                ({Math.floor(((drifter2?.abilityScores['STR'] ?? 10) - 10) / 2) >= 0 ? '+' : ''}
                {Math.floor(((drifter2?.abilityScores['STR'] ?? 10) - 10) / 2)})
              </div>
            </div>
            <div className="border border-green-900 p-1 text-center">
              <div className="text-xs">DEX</div>
              <div className="text-lg">{drifter2?.abilityScores['DEX'] ?? 10}</div>
              <div className="text-xs">
                ({Math.floor(((drifter2?.abilityScores['DEX'] ?? 10) - 10) / 2) >= 0 ? '+' : ''}
                {Math.floor(((drifter2?.abilityScores['DEX'] ?? 10) - 10) / 2)})
              </div>
            </div>
          </div>
          
          {/* Weapon */}
          <div className="border border-green-900 p-1 mb-4">
            <div className="font-semibold capitalize mb-0.5">
              Weapon: <span className="font-normal">{drifter2?.equipment.accessory?.name || 'Unarmed'}</span>
            </div>
            {drifter2?.equipment.accessory?.damage && (
              <p className="text-xs opacity-80">
                Damage: {drifter2.equipment.accessory.damage} {drifter2.equipment.accessory.damageType || ''}
              </p>
            )}
          </div>
          
          {/* Armor */}
          <div className="border border-green-900 p-1">
            <div className="font-semibold mb-0.5">AC: {drifter2?.baseAC}</div>
            <div className="text-xs opacity-80">
              {drifter2?.equipment.suit?.name || 'No Armor'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
