import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export interface CharacterSheetProps {
  drifterId: string;
  data?: {
    name: string;
    level: number;
    abilityScores: {
      strength: number;
      dexterity: number;
      constitution: number;
      intelligence: number;
      wisdom: number;
      charisma: number;
    };
    combatStats: {
      armorClass: number;
      hitPoints: number;
      speed: number;
    };
    equipment: Array<{
      name: string;
      type: string;
      properties: string[];
    }>;
  };
  isLoading?: boolean;
  error?: Error;
}

export const CharacterSheet: React.FC<CharacterSheetProps> = ({
  drifterId,
  data,
  isLoading = false,
  error,
}) => {
  if (isLoading) {
    return <div>Loading character sheet...</div>;
  }

  if (error) {
    return <div>Error loading character sheet: {error.message}</div>;
  }

  if (!data) {
    return <div>No character data available for {drifterId}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{data.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Basic Info */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <p>Level: {data.level}</p>
            </div>

            {/* Ability Scores */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Ability Scores</h3>
              {Object.entries(data.abilityScores).map(([ability, score]) => (
                <p key={ability}>
                  {ability.charAt(0).toUpperCase() + ability.slice(1)}: {score}
                </p>
              ))}
            </div>

            {/* Combat Stats */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Combat Statistics</h3>
              <p>Armor Class: {data.combatStats.armorClass}</p>
              <p>Hit Points: {data.combatStats.hitPoints}</p>
              <p>Speed: {data.combatStats.speed} ft</p>
            </div>

            {/* Equipment */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Equipment</h3>
              {data.equipment.map((item, index) => (
                <div key={index} className="border-b pb-2">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.type}</p>
                  {item.properties.length > 0 && (
                    <ul className="text-sm list-disc list-inside">
                      {item.properties.map((prop, i) => (
                        <li key={i}>{prop}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 