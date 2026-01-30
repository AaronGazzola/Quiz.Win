"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCharacterWithStoryAction,
  createStoryAction,
  updateStoryAction,
  getAvailableQuizSetsAction,
} from "./page.actions";
import type { StoryInsert, StoryUpdate } from "@/app/layout.types";

export function useCharacterWithStory(characterId: string) {
  return useQuery({
    queryKey: ["characterWithStory", characterId],
    queryFn: () => getCharacterWithStoryAction(characterId),
    enabled: !!characterId,
  });
}

export function useCreateStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (story: Omit<StoryInsert, "user_id">) =>
      createStoryAction(story),
    onSuccess: (newStory) => {
      queryClient.invalidateQueries({
        queryKey: ["characterWithStory", newStory.character_id],
      });
    },
  });
}

export function useUpdateStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      storyId,
      characterId,
      updates,
    }: {
      storyId: string;
      characterId: string;
      updates: StoryUpdate;
    }) => updateStoryAction(storyId, updates),
    onSuccess: (updatedStory) => {
      queryClient.invalidateQueries({
        queryKey: ["characterWithStory", updatedStory.character_id],
      });
    },
  });
}

export function useAvailableQuizSets() {
  return useQuery({
    queryKey: ["availableQuizSets"],
    queryFn: getAvailableQuizSetsAction,
  });
}
