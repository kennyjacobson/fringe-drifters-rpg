import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getDrifter } from '@fringe-rpg/core';
import { Badge } from "../components/ui/badge.js"; // Import Badge
import { HomeButton } from "../components/HomeButton.js";

// Re-use type definitions (or import if moved to a shared location)
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
  damage?: number; // Assuming this might be a string like "4d10" or a number
  damageRange?: {
    min: number;
    max: number;
  };
  // Add other relevant properties as needed from CharacterSheet.tsx
  industrialUse?: string;
  special?: string;
  warning?: string;
  vision?: string;
  environmentalProtection?: Record<string, number>;
  abilityModifiers?: Record<string, number>;
  acBonus?: number;
  baseAC?: number; // For Suits
  dexBonus?: number; // For Suits
  skillProficiencies?: string[]; // For Graphics
  factionRelations?: Record<string, string>; // For Graphics
  carryingCapacity?: number; // For Backpacks
  damageType?: string; // For Accessories
  range?: string; // For Accessories
}


export function CharacterSheetCompact() {
  const { drifterId } = useParams<{ drifterId: string }>();
  const [data, setData] = useState<CharacterData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [imageError, setImageError] = useState(false); // Keep image handling

  let drifterIdInt: number = 1;
  if (drifterId) {
    drifterIdInt = parseInt(drifterId);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Assuming getDrifter might need type assertion if its return type isn't specific enough
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

  // Error and Loading states
  if (error) {
    // Keep basic error styling for now
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  if (!data) {
    // Keep basic loading styling
    return <div className="p-4 text-gray-400">Loading Drifter Data...</div>;
  }

  // --- COMPACT LAYOUT START ---
  return (
    <div className="bg-black text-green-400 font-mono p-4 min-h-screen">
      {/* We will fill this with a grid layout */}
      <div className="flex justify-between items-center mb-4 border-b border-green-700 pb-2">
        <h1 className="text-xl">DRIFTER TERMINAL :: ID #{drifterId}</h1>
        <HomeButton />
      </div>

      <div className="grid grid-cols-3 grid-rows-[auto_1fr] gap-4">

        {/* Section 1: Header Info (Name, Image, Core Stats) - Span 1 col, potentially more rows */}
        <div className="col-span-1 row-span-1 border border-green-700 p-2">
          <h2 className="text-lg underline mb-2">IDENTIFICATION</h2>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-16 h-16 border border-green-700 p-0.5 bg-gray-800">
              {!imageError ? (
                <img
                  src={`https://omniscient.fringedrifters.com/main/images/${drifterId}.jpeg`}
                  alt={`Drifter #${drifterId}`}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-green-700">NO SIG</div>
              )}
            </div>
            <div>
              <p>ID: #{drifterId}</p>
              {/* Add other key identifiers if available/needed */}
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <p>DEFENSE CLASS: {data.baseAC}</p>
            {data.equipment.accessory && (
                <p>
                    WEAPON DMG: {data.equipment.accessory.damage}
                    {data.equipment.accessory.damageRange && ` (${data.equipment.accessory.damageRange.min}-${data.equipment.accessory.damageRange.max})`}
                </p>
            )}
            <p>CARRY CAPACITY: {data.carryingCapacity}</p>
          </div>
        </div>

        {/* Section 2: Ability Scores - Span 1 col */}
        <div className="col-span-1 row-span-1 border border-green-700 p-2 overflow-y-auto">
          <h2 className="text-lg underline mb-2">CORE ATTRIBUTES</h2>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(data.abilityScores).map(([ability, score]) => (
              <div key={ability} className="border border-green-900 p-1 text-center">
                <div className="text-sm font-bold">{ability}</div>
                <div className="text-xl">{score}</div>
                <div className="text-xs">
                  ({Math.floor((score - 10) / 2) >= 0 ? '+' : ''}
                  {Math.floor((score - 10) / 2)})
                </div>
              </div>
            ))}
          </div>
          {/* Resistances can go here too */}
           <h2 className="text-lg underline mt-4 mb-2">RESISTANCES</h2>
            <div className="flex flex-wrap gap-1 text-xs">
                {Object.entries(data.resistances).map(([type, value]) => (
                <Badge key={type} variant={value > 0 ? "default" : "outline"} className="bg-green-900 border-green-700 text-green-300">
                    {type.toUpperCase()}: {value}
                </Badge>
                ))}
            </div>
        </div>

        {/* Section 3: Skills - Span 1 col */}
        <div className="col-span-1 row-span-2 border border-green-700 p-2 overflow-y-auto"> {/* Span 2 rows */}
          <h2 className="text-lg underline mb-2">SKILLSET PROFICIENCY</h2>
          <div className="space-y-1 text-sm">
             {Object.entries(data.skills).sort(([a], [b]) => a.localeCompare(b)).map(([skill, details]) => (
               <div key={skill} className="flex items-center gap-2">
                 <span className={`w-2 h-2 inline-block ${details.proficient ? 'bg-green-500' : 'bg-green-900 border border-green-700'}`}></span>
                 <span className="flex-1">{skill}</span>
                 <span className="text-xs">({details.ability})</span>
                 <span className="font-semibold">
                    {details.modifier >= 0 ? '+' : ''}{details.modifier}
                 </span>
               </div>
             ))}
          </div>
        </div>

        {/* Section 4: Equipment - Span 2 cols */}
        <div className="col-span-2 row-span-1 border border-green-700 p-2">
           <h2 className="text-lg underline mb-2">EQUIPMENT MANIFEST</h2>
           <div className="grid grid-cols-2 gap-2 text-sm">
             {Object.entries(data.equipment).filter(([, item]) => item).map(([slot, item]) => (
               item && (
                 <div key={slot} className="border border-green-900 p-1">
                   <div className="font-semibold capitalize mb-0.5">{slot}: <span className="font-normal">{item.name}</span></div>
                   {/* Display relevant item properties compactly */}
                   {item.type && <p className="text-xs opacity-80">Type: {item.type}</p>}
                   {item.baseAC !== undefined && <p className="text-xs opacity-80">Base AC: {item.baseAC}</p>}
                   {item.acBonus !== undefined && <p className="text-xs opacity-80">AC Bonus: {item.acBonus}</p>}
                   {item.dexBonus !== undefined && <p className="text-xs opacity-80">DEX Bonus: {item.dexBonus}</p>}
                   {item.carryingCapacity !== undefined && <p className="text-xs opacity-80">Capacity: +{item.carryingCapacity}</p>}
                   {item.damage && <p className="text-xs opacity-80">Damage: {item.damage} {item.damageType}</p>}
                   {item.properties && item.properties.length > 0 && <p className="text-xs opacity-80">Props: {item.properties.join(', ')}</p>}
                   {item.special && <p className="text-xs text-green-300">Special: {item.special}</p>}
                   {/* Add more properties as needed */}
                 </div>
               )
             ))}
           </div>
        </div>

      </div>
    </div>
  );
}
