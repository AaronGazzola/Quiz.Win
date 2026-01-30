"use server";

import { createClient } from "@/supabase/server-client";
import type { StoryInsert, StoryUpdate } from "@/app/layout.types";

export async function getCharacterWithStoryAction(characterId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: character, error: charError } = await supabase
    .from("characters")
    .select("*")
    .eq("id", characterId)
    .eq("user_id", user.id)
    .single();

  if (charError) {
    console.error(charError);
    throw new Error("Failed to fetch character");
  }

  const { data: story } = await supabase
    .from("stories")
    .select("*")
    .eq("character_id", characterId)
    .maybeSingle();

  return { character, story };
}

export async function createStoryAction(
  story: Omit<StoryInsert, "user_id">
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("stories")
    .insert({
      ...story,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to create story");
  }

  return data;
}

export async function updateStoryAction(
  storyId: string,
  updates: StoryUpdate
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("stories")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", storyId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to update story");
  }

  return data;
}

export async function getAvailableQuizSetsAction() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("quiz_sets")
    .select(`
      id,
      title,
      description,
      tags,
      questions:questions(id)
    `)
    .or(`user_id.eq.${user.id},sharing.eq.PUBLIC`)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Failed to fetch quiz sets");
  }

  return data.map((qs) => ({
    ...qs,
    questionCount: qs.questions.length,
    questions: undefined,
  }));
}
