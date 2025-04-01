import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getDrifter } from '@fringe-rpg/core';
import { Card, CardContent, CardHeader } from "../components/card.js";
import { Badge } from "../components/ui/badge.js";

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
  damage?: number;
  damageRange?: {
    min: number;
    max: number;
  };
  // Additional properties from equipment database
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

export function CharacterSheet() {
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

  // Add this helper function inside the component
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
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
              {!imageError ? (
                <img
                  src={`https://omniscient.fringedrifters.com/main/images/${drifterId}.jpeg`}
                  alt={`Drifter #${drifterId}`}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">Drifter #{drifterId}</h1>
              <div className="flex gap-2 flex-wrap">
                <Badge>AC: {data.baseAC}</Badge>
                {data.equipment.accessory && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <span className="font-semibold">DMG:</span> {data.equipment.accessory.damage}
                    <span className="text-xs ml-1">
                      ({data.equipment.accessory.damageRange?.min}-{data.equipment.accessory.damageRange?.max})
                    </span>
                  </Badge>
                )}
                <Badge variant="outline">Carry: {data.carryingCapacity}</Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {Object.entries(data.resistances).map(([type, value]) => (
              <Badge key={type} variant={value > 0 ? "default" : "outline"}>
                {type}: {value}
              </Badge>
            ))}
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ability Scores Panel */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Ability Scores</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(data.abilityScores).map(([ability, score]) => (
                <div key={ability} className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-bold">{ability}</div>
                  <div className="text-2xl">{score}</div>
                  <div className="text-sm">
                    {Math.floor((score - 10) / 2) >= 0 ? '+' : ''}
                    {Math.floor((score - 10) / 2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Faction Relations section inside the Ability Scores card */}
            {Object.keys(getFactionRelations()).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Faction Relations</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(getFactionRelations()).map(([faction, relation]) => (
                    <div key={faction} className="flex items-center gap-2 p-2 border rounded">
                      <div className="flex-1">
                        <div className="font-medium">{faction}</div>
                        <div className="text-sm text-gray-600">{relation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Equipment Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Equipment</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.equipment).map(([slot, item]) => (
                item && (
                  <div key={slot} className="border rounded-lg p-4">
                    <div className="font-semibold capitalize">{slot}</div>
                    <div className="text-sm text-gray-600">{item.name}</div>
                    {item.industrialUse && (
                      <div className="text-sm text-gray-500 mt-1">
                        <span className="font-medium">Use:</span> {item.industrialUse}
                      </div>
                    )}
                    {item.special && (
                      <div className="text-sm text-blue-600 mt-1">
                        <span className="font-medium">Special:</span> {item.special}
                      </div>
                    )}
                    {item.properties && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.properties.map((prop) => (
                          <Badge key={prop} variant="secondary">{prop}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Grid */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Skills</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(data.skills).map(([skill, details]) => (
              <div key={skill} className="flex items-center gap-2 p-2 border rounded">
                <div className={`w-2 h-2 rounded-full ${details.proficient ? 'bg-primary' : 'bg-gray-200'}`} />
                <div>
                  <div className="font-medium">{skill}</div>
                  <div className="text-sm text-gray-600">
                    {details.ability} {details.modifier >= 0 ? '+' : ''}{details.modifier}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}