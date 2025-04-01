import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getDrifter } from '@fringe-rpg/core';
// import { driftersDatabase as generatedDriftersDatabase } from './generated/drifters';
// import { DrifterDatabase } from '../types';

export function CharacterSheetAPI() {
  const { drifterId } = useParams<{ drifterId: string }>();
  let drifterIdInt: number = 1
  if (drifterId) {
    drifterIdInt = parseInt(drifterId);
  }
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const characterData = await getDrifter(drifterIdInt);
        setData(characterData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch character data'));
      }
    };

    if (drifterId) {
      fetchData();
    }
  }, [drifterId]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

// export const driftersDatabase: DrifterDatabase = {
//   ...driftersDatabase,
//   // Add any manual overrides or additions here
// }

// Type guard to ensure drifter exists in database
// export function isValidDrifter(drifterId: number): boolean {
//   return drifterId in driftersDatabase;
// } 