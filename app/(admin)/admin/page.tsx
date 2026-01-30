"use client";

import { useRouter } from "next/navigation";
import {
  Users,
  BookOpen,
  Swords,
  Trophy,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/app/layout.stores";
import { useAdminStore } from "./page.stores";
import { useAdminStats, useAdminUsers, useUpdateUserRole } from "./page.hooks";
import type { UserRole, Profile } from "@/app/layout.types";

function StatsCard({
  icon: Icon,
  label,
  value,
  isLoading,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  isLoading: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className="rounded-full bg-primary/10 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          {isLoading ? (
            <Skeleton className="h-8 w-16 mb-1" />
          ) : (
            <p className="text-2xl font-bold">{value.toLocaleString()}</p>
          )}
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function UserRow({ user, isSuperAdmin }: { user: Profile; isSuperAdmin: boolean }) {
  const updateRole = useUpdateUserRole();

  const handleRoleChange = (role: UserRole) => {
    updateRole.mutate({ profileId: user.id, role });
  };

  const roleBadgeVariant = {
    user: "secondary" as const,
    admin: "default" as const,
    "super-admin": "destructive" as const,
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url ?? undefined} />
            <AvatarFallback>
              {user.display_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.display_name}</p>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        {isSuperAdmin ? (
          <Select
            value={user.role}
            onValueChange={handleRoleChange}
            disabled={updateRole.isPending}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="super-admin">Super Admin</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Badge variant={roleBadgeVariant[user.role]}>
            {user.role}
          </Badge>
        )}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {new Date(user.created_at).toLocaleDateString()}
      </TableCell>
    </TableRow>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, profile } = useAuthStore();
  const { currentPage, setPage } = useAdminStore();
  const adminStats = useAdminStats();
  const adminUsers = useAdminUsers(currentPage);

  const isAdmin = profile?.role === "admin" || profile?.role === "super-admin";
  const isSuperAdmin = profile?.role === "super-admin";

  if (!isAuthenticated) {
    router.push("/sign-in");
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don&apos;t have permission to access the admin panel
            </p>
            <Button onClick={() => router.push("/")}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users and monitor platform activity
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          icon={Users}
          label="Total Users"
          value={adminStats.data?.totalUsers ?? 0}
          isLoading={adminStats.isLoading}
        />
        <StatsCard
          icon={BookOpen}
          label="Total Quiz Sets"
          value={adminStats.data?.totalQuizSets ?? 0}
          isLoading={adminStats.isLoading}
        />
        <StatsCard
          icon={Swords}
          label="Total Characters"
          value={adminStats.data?.totalCharacters ?? 0}
          isLoading={adminStats.isLoading}
        />
        <StatsCard
          icon={Trophy}
          label="Total Attempts"
          value={adminStats.data?.totalAttempts ?? 0}
          isLoading={adminStats.isLoading}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View and manage all registered users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {adminUsers.isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : adminUsers.data?.users.length ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.data.users.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      isSuperAdmin={isSuperAdmin}
                    />
                  ))}
                </TableBody>
              </Table>

              {adminUsers.data.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {adminUsers.data.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(currentPage + 1)}
                      disabled={currentPage === adminUsers.data.totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
