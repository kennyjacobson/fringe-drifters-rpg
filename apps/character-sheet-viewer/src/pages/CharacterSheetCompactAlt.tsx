import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getDrifter } from '@fringe-rpg/core';

// Add type definition for our character data
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
}

export function CharacterSheetCompactAlt() {
  const { drifterId } = useParams<{ drifterId: string }>();
  const [data, setData] = useState<CharacterData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [imageError, setImageError] = useState(false);

  let drifterIdInt: number = 1
  if (drifterId) {
    drifterIdInt = parseInt(drifterId);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const characterData = getDrifter(drifterIdInt);
        setData(characterData as CharacterData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch character data'));
      }
    };

    if (drifterId) {
      fetchData();
    }
  }, [drifterId]);

  const getFactionRelations = () => {
    const relations: Record<string, string> = {};
    Object.values(data?.equipment || {}).forEach(item => {
      if (item?.factionRelations) {
        Object.entries(item.factionRelations).forEach(([faction, relation]) => {
          relations[faction] = relation;
        });
      }
    });
    return relations;
  };

  if (error) {
    return <div className="bg-black text-green-500 p-4 font-mono">Error: {error.message}</div>;
  }

  if (!data) {
    return <div className="bg-black text-green-500 p-4 font-mono">Loading...</div>;
  }

  return (
    <div className="bg-black text-green-500 font-mono p-4 min-h-screen flex flex-col">
      {/* Terminal header */}
      <div className="border-b border-green-500 pb-2 mb-4">
        <div className="flex justify-between items-center">
          <div className="text-xl tracking-wider">FRINGE DRIFTER TERMINAL v1.7</div>
          <div>ID: {drifterId} • ACCESS: GRANTED</div>
        </div>
      </div>

      {/* Main content in grid layout */}
      <div className="grid grid-cols-12 gap-4 h-full">
        {/* Left column - Image and core stats */}
        <div className="col-span-3 border border-green-500 p-3 flex flex-col">
          <div className="text-center border-b border-green-500 pb-2 mb-3">
            <div className="text-lg">DRIFTER #{drifterId}</div>
          </div>
          
          <div className="flex-1 flex flex-col">
            {/* Character Image */}
            <div className="mb-4 aspect-square border border-green-500 relative overflow-hidden">
              {!imageError ? (
                <img
                  src={`https://omniscient.fringedrifters.com/main/images/${drifterId}.jpeg`}
                  alt={`Drifter #${drifterId}`}
                  className="w-full h-full object-cover opacity-80 mix-blend-screen"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  [IMAGE UNAVAILABLE]
                </div>
              )}
              <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30"></div>
            </div>
            
            {/* Core Stats */}
            <div className="text-center space-y-2">
              <div className="border border-green-500 p-2">
                <div className="text-xs">AC</div>
                <div className="text-2xl">{data.baseAC}</div>
              </div>
              
              <div className="border border-green-500 p-2">
                <div className="text-xs">CARRY</div>
                <div className="text-2xl">{data.carryingCapacity}</div>
              </div>
              
              {data.equipment.accessory && (
                <div className="border border-green-500 p-2">
                  <div className="text-xs">DMG</div>
                  <div className="text-lg">{data.equipment.accessory.damage}</div>
                  <div className="text-xs">
                    ({data.equipment.accessory.damageRange?.min}-{data.equipment.accessory.damageRange?.max})
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle column - Abilities and Skills */}
        <div className="col-span-5 grid grid-rows-2 gap-4">
          {/* Abilities */}
          <div className="border border-green-500 p-3">
            <div className="text-center border-b border-green-500 pb-1 mb-3">
              <div className="text-lg">ABILITY SCORES</div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(data.abilityScores).map(([ability, score]) => (
                <div key={ability} className="border border-green-500 p-2 text-center">
                  <div className="text-sm">{ability}</div>
                  <div className="text-2xl">{score}</div>
                  <div className="text-sm">
                    {Math.floor((score - 10) / 2) >= 0 ? '+' : ''}
                    {Math.floor((score - 10) / 2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Skills */}
          <div className="border border-green-500 p-3">
            <div className="text-center border-b border-green-500 pb-1 mb-3">
              <div className="text-lg">SKILLS</div>
            </div>
            
            <div className="grid grid-cols-3 gap-x-2 gap-y-1 h-[calc(100%-2rem)] overflow-y-auto">
              {Object.entries(data.skills).map(([skill, details]) => (
                <div key={skill} className="flex items-center text-sm">
                  <div className={`mr-1 ${details.proficient ? '■' : '□'}`}>
                    {details.proficient ? '■' : '□'}
                  </div>
                  <div className="flex-1 truncate">{skill}</div>
                  <div className="ml-1">
                    {details.modifier >= 0 ? '+' : ''}{details.modifier}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column - Equipment and Resistances */}
        <div className="col-span-4 flex flex-col gap-4">
          {/* Resistances */}
          <div className="border border-green-500 p-3">
            <div className="text-center border-b border-green-500 pb-1 mb-2">
              <div className="text-lg">RESISTANCES</div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {Object.entries(data.resistances).map(([type, value]) => (
                <div key={type} className={`border ${value > 0 ? 'border-green-500 bg-green-900 bg-opacity-20' : 'border-green-500'} px-2 py-1`}>
                  {type}: {value}
                </div>
              ))}
            </div>
          </div>
          
          {/* Equipment */}
          <div className="border border-green-500 p-3 flex-1">
            <div className="text-center border-b border-green-500 pb-1 mb-3">
              <div className="text-lg">EQUIPMENT</div>
            </div>
            
            <div className="space-y-2 h-[calc(100%-2rem)] overflow-y-auto">
              {Object.entries(data.equipment).map(([slot, item]) => (
                item && (
                  <div key={slot} className="border border-green-500 p-2">
                    <div className="flex justify-between border-b border-green-500 border-dashed pb-1 mb-1">
                      <span className="uppercase text-sm">{slot}</span>
                      <span className="text-xs">TYPE: {item.type}</span>
                    </div>
                    <div className="text-sm mb-1">{item.name}</div>
                    {item.special && (
                      <div className="text-xs mb-1 text-green-300">SPECIAL: {item.special}</div>
                    )}
                    {item.properties && item.properties.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.properties.map(prop => (
                          <span key={prop} className="text-xs border border-green-500 px-1">
                            {prop}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
          
          {/* Faction Relations */}
          {Object.keys(getFactionRelations()).length > 0 && (
            <div className="border border-green-500 p-3">
              <div className="text-center border-b border-green-500 pb-1 mb-2">
                <div className="text-lg">FACTION RELATIONS</div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(getFactionRelations()).map(([faction, relation]) => (
                  <div key={faction} className="text-xs">
                    <span className="text-green-300">{faction}:</span> {relation}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Terminal footer */}
      <div className="border-t border-green-500 mt-4 pt-2 text-sm flex justify-between">
        <div>FRINGE DRIFTER DATABASE • THE MAVEN</div>
        <div className="blink">█</div>
        <div>[ESC] TO EXIT</div>
      </div>
      
      {/* Regular style tag without jsx prop */}
      <style>
        {`
        @keyframes blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .blink {
          animation: blink 1s infinite;
        }
        `}
      </style>
    </div>
  );
}
