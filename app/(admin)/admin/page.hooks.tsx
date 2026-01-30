"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAdminStore } from "./page.stores";
import {
  getAdminStatsAction,
  getAdminUsersAction,
  updateUserRoleAction,
} from "./page.actions";
import type { UserRole } from "@/app/layout.types";

export function useAdminStats() {
  return useQuery({
    queryKey: ["adminStats"],
    queryFn: getAdminStatsAction,
  });
}

export function useAdminUsers(page: number = 1) {
  const { setUsers } = useAdminStore();

  return useQuery({
    queryKey: ["adminUsers", page],
    queryFn: async () => {
      const result = await getAdminUsersAction(page);
      setUsers(result.users, result.total);
      return result;
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  const { updateUser } = useAdminStore();

  return useMutation({
    mutationFn: ({ profileId, role }: { profileId: string; role: UserRole }) =>
      updateUserRoleAction(profileId, role),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser.id, updatedUser);
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });
}
