"use server";

import { createClient } from "@/supabase/server-client";
import type { CharacterInsert, CharacterUpdate } from "@/app/layout.types";

export async function getUserCharactersAction() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("characters")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Failed to fetch characters");
  }

  return data;
}

export async function getCharacterAction(characterId: string) {
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
    .single();

  if (charError) {
    console.error(charError);
    throw new Error("Failed to fetch character");
  }

  if (character.user_id !== user.id && !character.is_public) {
    throw new Error("Unauthorized");
  }

  const { data: story } = await supabase
    .from("stories")
    .select("*")
    .eq("character_id", characterId)
    .maybeSingle();

  return { ...character, story };
}

export async function createCharacterAction(
  character: Omit<CharacterInsert, "user_id" | "profile_id">
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile) {
    console.error(profileError);
    throw new Error("Profile not found");
  }

  const defaultStats = {
    strength: 10,
    intelligence: 10,
    agility: 10,
    endurance: 10,
  };

  const classBonus = {
    WIZARD: { intelligence: 5 },
    BRUTE: { strength: 5 },
    ASSASSIN: { agility: 5 },
  };

  const stats = {
    ...defaultStats,
    ...classBonus[character.class],
  };

  const { data, error } = await supabase
    .from("characters")
    .insert({
      ...character,
      user_id: user.id,
      profile_id: profile.id,
      stats,
      inventory: [],
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to create character");
  }

  return data;
}

export async function updateCharacterAction(
  characterId: string,
  updates: CharacterUpdate
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
    .from("characters")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", characterId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to update character");
  }

  return data;
}

export async function deleteCharacterAction(characterId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("characters")
    .delete()
    .eq("id", characterId)
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    throw new Error("Failed to delete character");
  }

  return { success: true };
}
