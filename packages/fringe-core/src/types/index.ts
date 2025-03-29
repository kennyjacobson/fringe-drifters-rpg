export type AbilityScore = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

export type Resistance = 'cold' | 'heat' | 'toxin' | 'radiation' | 'seismic';

export type Skill = {
  ability: AbilityScore;
  proficient: boolean;
  modifier: number;
  bonus?: number;
};

export type Character = {
  abilityScores: Record<AbilityScore, number>;
  baseAC: number;
  resistances: Record<Resistance, number>;
  skills: Record<string, Skill>;
  equipment: {
    suit: string | null;
    helmet: string | null;
    accessory: string | null;
    backpack: string | null;
    mouthMachine: string | null;
    iconography: string | null;
  };
  carryingCapacity: number;
};

export type NFTTraits = {
  suit?: string;
  helmet?: string;
  accessory?: string;
  backpack?: string;
  mouthMachine?: string;
  iconography?: string;
};