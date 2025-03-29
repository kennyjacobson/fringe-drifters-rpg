import { AbilityScore } from '../types';
import { generatedEquipmentDatabase } from './generated/equipment';

export const equipmentDatabase = {
  ...generatedEquipmentDatabase,
  // Add any manual overrides or additions here
} as const;

// Type guard to ensure equipment exists in database
export function isValidEquipment(
  category: keyof typeof equipmentDatabase,
  item: string
): boolean {
  return item in equipmentDatabase[category];
}