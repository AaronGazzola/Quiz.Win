"use server";

import { createClient } from "@/supabase/server-client";
import type { ProfileInsert, ProfileUpdate } from "./layout.types";

export async function getCurrentUserAction() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error(error);
    throw new Error("Failed to get current user");
  }

  return user;
}

export async function getProfileAction(userId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to fetch profile");
  }

  return data;
}

export async function getProfileByUsernameAction(username: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to fetch profile");
  }

  return data;
}

export async function createProfileAction(profile: ProfileInsert) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      ...profile,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to create profile");
  }

  return data;
}

export async function updateProfileAction(
  profileId: string,
  updates: ProfileUpdate
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
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profileId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to update profile");
  }

  return data;
}

export async function getCommunityStatsAction() {
  const supabase = await createClient();

  const [profilesResult, quizSetsResult, charactersResult, attemptsResult] =
    await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase
        .from("quiz_sets")
        .select("id", { count: "exact", head: true })
        .eq("sharing", "PUBLIC"),
      supabase
        .from("characters")
        .select("id", { count: "exact", head: true })
        .eq("is_public", true),
      supabase.from("quiz_attempts").select("id", { count: "exact", head: true }),
    ]);

  return {
    totalUsers: profilesResult.count ?? 0,
    totalQuizSets: quizSetsResult.count ?? 0,
    totalCharacters: charactersResult.count ?? 0,
    totalCompletions: attemptsResult.count ?? 0,
  };
}

export async function getPopularQuizSetsAction(limit: number = 6) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quiz_sets")
    .select(
      `
      *,
      profile:profiles!fk_quiz_sets_profile_id(username, display_name, avatar_url)
    `
    )
    .eq("sharing", "PUBLIC")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(error);
    throw new Error("Failed to fetch popular quiz sets");
  }

  return data;
}

export async function getFeaturedCharactersAction(limit: number = 6) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("characters")
    .select(
      `
      *,
      profile:profiles!fk_characters_profile_id(username, display_name, avatar_url)
    `
    )
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(error);
    throw new Error("Failed to fetch featured characters");
  }

  return data;
}

export async function getRecentCompletionsAction(limit: number = 10) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quiz_attempts")
    .select(
      `
      id,
      score,
      completed_at,
      profile:profiles!fk_quiz_attempts_profile_id(username, display_name, avatar_url),
      quiz_set:quiz_sets!fk_quiz_attempts_quiz_set_id(title)
    `
    )
    .order("completed_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(error);
    throw new Error("Failed to fetch recent completions");
  }

  return data.map((item) => ({
    id: item.id,
    profile: item.profile,
    quizSet: item.quiz_set,
    score: item.score,
    completedAt: item.completed_at,
  }));
}

export async function checkUsernameAvailableAction(username: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Failed to check username availability");
  }

  return data === null;
}
