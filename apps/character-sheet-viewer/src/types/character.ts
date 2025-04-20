export interface CharacterData {
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
  
  export interface EquipmentItem {
    name: string;
    type: string;
    properties?: string[];
    damage?: number;
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
    baseAC?: number; // For Suits
    dexBonus?: number; // For Suits
    skillProficiencies?: string[]; // For Graphics
    factionRelations?: Record<string, string>; // For Graphics
    carryingCapacity?: number; // For Backpacks
    damageType?: string; // For Accessories
    range?: string; // For Accessories
  }