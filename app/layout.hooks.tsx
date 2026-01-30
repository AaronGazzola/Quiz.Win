"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBrowserClient } from "@/supabase/browser-client";
import { useAuthStore } from "./layout.stores";
import {
  getCurrentUserAction,
  getProfileAction,
  getCommunityStatsAction,
  getPopularQuizSetsAction,
  getFeaturedCharactersAction,
  getRecentCompletionsAction,
  updateProfileAction,
} from "./layout.actions";
import type {
  SignInCredentials,
  SignUpCredentials,
  ProfileUpdate,
} from "./layout.types";

export function useCurrentUser() {
  const { setUser, setProfile, clearAuth } = useAuthStore();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const user = await getCurrentUserAction();
      if (user) {
        setUser(user);
        try {
          const profile = await getProfileAction(user.id);
          setProfile(profile);
        } catch {
          setProfile(null);
        }
      } else {
        clearAuth();
      }
      return user;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useProfile(userId: string) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfileAction(userId),
    enabled: !!userId,
  });
}

export function useSignIn() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: async ({ email, password }: SignInCredentials) => {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error(error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

export function useSignUp() {
  return useMutation({
    mutationFn: async ({
      email,
      password,
      username,
      displayName,
    }: SignUpCredentials) => {
      const supabase = createBrowserClient();
      const redirectUrl = `${window.location.origin}/auth/callback?next=/welcome`;
      console.log("Sign-up redirect URL:", redirectUrl);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username,
            display_name: displayName,
          },
        },
      });

      console.log("Sign-up response:", {
        user: data.user,
        session: data.session,
        error,
      });

      if (data.user) {
        console.log("User metadata:", data.user.user_metadata);
        console.log("Email confirmed at:", data.user.email_confirmed_at);
        console.log("Confirmation sent at:", data.user.confirmation_sent_at);
      }

      if (error) {
        console.error("Sign-up error:", error);
        throw new Error(error.message);
      }

      return data;
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      const supabase = createBrowserClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error(error);
        throw new Error("Failed to sign out");
      }
    },
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
    },
  });
}

export function usePasswordResetEmail() {
  return useMutation({
    mutationFn: async (email: string) => {
      const supabase = createBrowserClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error(error);
        throw new Error(error.message);
      }
    },
  });
}

export function usePasswordReset() {
  return useMutation({
    mutationFn: async (newPassword: string) => {
      const supabase = createBrowserClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error(error);
        throw new Error(error.message);
      }
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setProfile } = useAuthStore();

  return useMutation({
    mutationFn: ({
      profileId,
      updates,
    }: {
      profileId: string;
      updates: ProfileUpdate;
    }) => updateProfileAction(profileId, updates),
    onSuccess: (updatedProfile) => {
      setProfile(updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({
        queryKey: ["profile", updatedProfile.user_id],
      });
    },
  });
}

export function useCommunityStats() {
  return useQuery({
    queryKey: ["communityStats"],
    queryFn: getCommunityStatsAction,
    staleTime: 60 * 1000,
  });
}

export function usePopularQuizSets(limit: number = 6) {
  return useQuery({
    queryKey: ["popularQuizSets", limit],
    queryFn: () => getPopularQuizSetsAction(limit),
    staleTime: 60 * 1000,
  });
}

export function useFeaturedCharacters(limit: number = 6) {
  return useQuery({
    queryKey: ["featuredCharacters", limit],
    queryFn: () => getFeaturedCharactersAction(limit),
    staleTime: 60 * 1000,
  });
}

export function useRecentCompletions(limit: number = 10) {
  return useQuery({
    queryKey: ["recentCompletions", limit],
    queryFn: () => getRecentCompletionsAction(limit),
    staleTime: 30 * 1000,
  });
}
