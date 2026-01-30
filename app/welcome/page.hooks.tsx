"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProfileAction,
  updateProfileAction,
  getProfileAction,
} from "@/app/layout.actions";
import { useAuthStore } from "@/app/layout.stores";
import type { ProfileUpdate } from "@/app/layout.types";

export function useCreateProfileFromMetadata() {
  const queryClient = useQueryClient();
  const { user, setProfile } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");

      const username = user.user_metadata?.username;
      const displayName = user.user_metadata?.display_name;

      if (!username || !displayName) {
        throw new Error("Missing profile data from sign-up");
      }

      return createProfileAction({
        user_id: user.id,
        username,
        display_name: displayName,
        updated_at: new Date().toISOString(),
      });
    },
    onSuccess: (profile) => {
      setProfile(profile);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

export function useWelcomeProfile() {
  const { user, setProfile } = useAuthStore();

  return useQuery({
    queryKey: ["welcomeProfile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      try {
        const profile = await getProfileAction(user.id);
        setProfile(profile);
        return profile;
      } catch {
        return null;
      }
    },
    enabled: !!user,
  });
}

export function useCompleteProfile() {
  const queryClient = useQueryClient();
  const { setProfile, profile } = useAuthStore();

  return useMutation({
    mutationFn: async (updates: ProfileUpdate) => {
      if (!profile) throw new Error("No profile found");
      return updateProfileAction(profile.id, updates);
    },
    onSuccess: (updatedProfile) => {
      setProfile(updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}
