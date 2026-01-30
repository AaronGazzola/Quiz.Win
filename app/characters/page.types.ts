import type { Character, CharacterClass, Story } from "@/app/layout.types";

export type CharacterStats = {
  strength: number;
  intelligence: number;
  agility: number;
  endurance: number;
};

export type CharacterInventoryItem = {
  id: string;
  name: string;
  type: "weapon" | "armor" | "consumable" | "artifact";
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  stats?: Partial<CharacterStats>;
};

export type CharacterWithStory = Character & {
  story?: Story | null;
};

export type CreateCharacterForm = {
  name: string;
  class: CharacterClass;
};
