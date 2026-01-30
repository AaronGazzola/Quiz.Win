"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCharacterStore } from "./page.stores";
import {
  getUserCharactersAction,
  getCharacterAction,
  createCharacterAction,
  updateCharacterAction,
  deleteCharacterAction,
} from "./page.actions";
import type { CharacterInsert, CharacterUpdate } from "@/app/layout.types";

export function useUserCharacters() {
  const { setCharacters } = useCharacterStore();

  return useQuery({
    queryKey: ["userCharacters"],
    queryFn: async () => {
      const characters = await getUserCharactersAction();
      setCharacters(characters);
      return characters;
    },
  });
}

export function useCharacter(characterId: string | null) {
  return useQuery({
    queryKey: ["character", characterId],
    queryFn: () => getCharacterAction(characterId!),
    enabled: !!characterId,
  });
}

export function useCreateCharacter() {
  const queryClient = useQueryClient();
  const { addCharacter } = useCharacterStore();

  return useMutation({
    mutationFn: (character: Omit<CharacterInsert, "user_id" | "profile_id">) =>
      createCharacterAction(character),
    onSuccess: (newCharacter) => {
      addCharacter(newCharacter);
      queryClient.invalidateQueries({ queryKey: ["userCharacters"] });
    },
  });
}

export function useUpdateCharacter() {
  const queryClient = useQueryClient();
  const { updateCharacter } = useCharacterStore();

  return useMutation({
    mutationFn: ({
      characterId,
      updates,
    }: {
      characterId: string;
      updates: CharacterUpdate;
    }) => updateCharacterAction(characterId, updates),
    onSuccess: (updatedCharacter) => {
      updateCharacter(updatedCharacter.id, updatedCharacter);
      queryClient.invalidateQueries({ queryKey: ["userCharacters"] });
      queryClient.invalidateQueries({
        queryKey: ["character", updatedCharacter.id],
      });
    },
  });
}

export function useDeleteCharacter() {
  const queryClient = useQueryClient();
  const { removeCharacter } = useCharacterStore();

  return useMutation({
    mutationFn: (characterId: string) => deleteCharacterAction(characterId),
    onSuccess: (_, characterId) => {
      removeCharacter(characterId);
      queryClient.invalidateQueries({ queryKey: ["userCharacters"] });
    },
  });
}
