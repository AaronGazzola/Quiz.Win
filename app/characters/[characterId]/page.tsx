"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Shield,
  Brain,
  Zap,
  Play,
  Trash2,
  Globe,
  Lock,
  Loader2,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuthStore } from "@/app/layout.stores";
import { useCharacter, useUpdateCharacter, useDeleteCharacter } from "./page.hooks";
import { cn } from "@/lib/utils";
import type { CharacterStats, CharacterInventoryItem } from "../page.types";

const characterClasses = {
  WIZARD: { name: "Wizard", icon: "🧙", color: "bg-blue-500" },
  BRUTE: { name: "Brute", icon: "💪", color: "bg-red-500" },
  ASSASSIN: { name: "Assassin", icon: "🗡️", color: "bg-purple-500" },
};

function StatBar({
  icon: Icon,
  label,
  value,
  maxValue = 30,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  maxValue?: number;
  color: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-5 w-5", color)} />
          <span className="font-medium">{label}</span>
        </div>
        <span className="text-lg font-bold">{value}</span>
      </div>
      <Progress value={(value / maxValue) * 100} className="h-3" />
    </div>
  );
}

function InventoryItem({ item }: { item: CharacterInventoryItem }) {
  const rarityColors = {
    common: "border-gray-500 bg-gray-500/10",
    uncommon: "border-green-500 bg-green-500/10",
    rare: "border-blue-500 bg-blue-500/10",
    epic: "border-purple-500 bg-purple-500/10",
    legendary: "border-yellow-500 bg-yellow-500/10",
  };

  return (
    <div
      className={cn(
        "rounded-lg border-2 p-3",
        rarityColors[item.rarity]
      )}
    >
      <p className="font-medium text-sm">{item.name}</p>
      <Badge variant="outline" className="text-xs mt-1">
        {item.type}
      </Badge>
    </div>
  );
}

export default function CharacterDetailPage({
  params,
}: {
  params: Promise<{ characterId: string }>;
}) {
  const { characterId } = use(params);
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { data: character, isLoading, error } = useCharacter(characterId);
  const updateCharacter = useUpdateCharacter();
  const deleteCharacter = useDeleteCharacter();

  if (!isAuthenticated) {
    router.push("/sign-in");
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Character not found</p>
            <Button asChild>
              <Link href="/characters">Back to Characters</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwner = character.user_id === user?.id;
  const classInfo = characterClasses[character.class];
  const stats = (character.stats as CharacterStats) || {
    strength: 10,
    intelligence: 10,
    agility: 10,
    endurance: 10,
  };
  const inventory = (character.inventory as CharacterInventoryItem[]) || [];

  const handleVisibilityToggle = () => {
    updateCharacter.mutate({
      characterId: character.id,
      updates: { is_public: !character.is_public },
    });
  };

  const handleDelete = () => {
    deleteCharacter.mutate(character.id, {
      onSuccess: () => router.push("/characters"),
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/characters">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Characters
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "text-4xl p-3 rounded-xl bg-opacity-20",
                      classInfo.color
                    )}
                  >
                    {classInfo.icon}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{character.name}</CardTitle>
                    <CardDescription className="text-lg">
                      {classInfo.name}
                    </CardDescription>
                  </div>
                </div>
                {isOwner && (
                  <div className="flex items-center gap-2">
                    {character.is_public ? (
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Switch
                      checked={character.is_public}
                      onCheckedChange={handleVisibilityToggle}
                      disabled={updateCharacter.isPending}
                    />
                    <Label className="text-sm text-muted-foreground">
                      Public
                    </Label>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span className="font-medium">Health</span>
                  </div>
                  <span className="text-lg font-bold">
                    {character.health}/100
                  </span>
                </div>
                <Progress
                  value={(character.health / 100) * 100}
                  className="h-4"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatBar
                  icon={Shield}
                  label="Strength"
                  value={stats.strength}
                  color="text-orange-500"
                />
                <StatBar
                  icon={Brain}
                  label="Intelligence"
                  value={stats.intelligence}
                  color="text-blue-500"
                />
                <StatBar
                  icon={Zap}
                  label="Agility"
                  value={stats.agility}
                  color="text-yellow-500"
                />
                <StatBar
                  icon={Heart}
                  label="Endurance"
                  value={stats.endurance}
                  color="text-green-500"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventory
              </CardTitle>
            </CardHeader>
            <CardContent>
              {inventory.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No items yet. Complete quizzes to earn loot!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {inventory.map((item) => (
                    <InventoryItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link href={`/adventure/${character.id}`}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Adventure
                </Link>
              </Button>
              {isOwner && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Character
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete character?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete {character.name} and all
                        their progress. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {deleteCharacter.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Delete"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardContent>
          </Card>

          {character.story && (
            <Card>
              <CardHeader>
                <CardTitle>Story Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Current branch: {character.story.current_branch}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
