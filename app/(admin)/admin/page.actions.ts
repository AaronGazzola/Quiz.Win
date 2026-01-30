"use server";

import { createClient } from "@/supabase/server-client";
import type { UserRole } from "@/app/layout.types";

export async function getAdminStatsAction() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!profile || (profile.role !== "admin" && profile.role !== "super-admin")) {
    throw new Error("Unauthorized - Admin access required");
  }

  const [profilesResult, quizSetsResult, charactersResult, attemptsResult] =
    await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("quiz_sets").select("id", { count: "exact", head: true }),
      supabase.from("characters").select("id", { count: "exact", head: true }),
      supabase.from("quiz_attempts").select("id", { count: "exact", head: true }),
    ]);

  return {
    totalUsers: profilesResult.count ?? 0,
    totalQuizSets: quizSetsResult.count ?? 0,
    totalCharacters: charactersResult.count ?? 0,
    totalAttempts: attemptsResult.count ?? 0,
  };
}

export async function getAdminUsersAction(page: number = 1, limit: number = 20) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!adminProfile || (adminProfile.role !== "admin" && adminProfile.role !== "super-admin")) {
    throw new Error("Unauthorized - Admin access required");
  }

  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error(error);
    throw new Error("Failed to fetch users");
  }

  return {
    users: data,
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  };
}

export async function updateUserRoleAction(profileId: string, role: UserRole) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!adminProfile || adminProfile.role !== "super-admin") {
    throw new Error("Unauthorized - Super admin access required");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", profileId)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to update user role");
  }

  return data;
}
