import { create } from "zustand";
import type { Character } from "@/app/layout.types";

type CharacterStore = {
  characters: Character[];
  selectedCharacterId: string | null;
  setCharacters: (characters: Character[]) => void;
  selectCharacter: (id: string | null) => void;
  addCharacter: (character: Character) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  removeCharacter: (id: string) => void;
};

export const useCharacterStore = create<CharacterStore>((set) => ({
  characters: [],
  selectedCharacterId: null,
  setCharacters: (characters) => set({ characters }),
  selectCharacter: (id) => set({ selectedCharacterId: id }),
  addCharacter: (character) =>
    set((state) => ({ characters: [character, ...state.characters] })),
  updateCharacter: (id, updates) =>
    set((state) => ({
      characters: state.characters.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),
  removeCharacter: (id) =>
    set((state) => ({
      characters: state.characters.filter((c) => c.id !== id),
      selectedCharacterId:
        state.selectedCharacterId === id ? null : state.selectedCharacterId,
    })),
}));

type CreateCharacterDialogStore = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useCreateCharacterDialogStore = create<CreateCharacterDialogStore>(
  (set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
  })
);
