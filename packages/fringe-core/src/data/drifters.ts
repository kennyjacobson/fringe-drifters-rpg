import { driftersDatabase as generatedDriftersDatabase } from './generated/drifters';
import { DrifterDatabase } from '../types';

export const driftersDatabase: DrifterDatabase = {
  ...generatedDriftersDatabase,
  // Add any manual overrides or additions here
}

// Type guard to ensure drifter exists in database
export function isValidDrifter(drifterId: number): boolean {
  return drifterId in driftersDatabase;
}
