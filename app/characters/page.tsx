"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Swords,
  Plus,
  Heart,
  Shield,
  Zap,
  Brain,
  Loader2,
  Globe,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthStore } from "@/app/layout.stores";
import {
  useCharacterStore,
  useCreateCharacterDialogStore,
} from "./page.stores";
import { useUserCharacters, useCreateCharacter } from "./page.hooks";
import { cn } from "@/lib/utils";
import type { CharacterClass, Character } from "@/app/layout.types";
import type { CharacterStats } from "./page.types";

const characterClasses: {
  value: CharacterClass;
  name: string;
  description: string;
  icon: string;
  color: string;
}[] = [
  {
    value: "WIZARD",
    name: "Wizard",
    description: "Master of arcane knowledge. +5 Intelligence",
    icon: "🧙",
    color: "bg-blue-500",
  },
  {
    value: "BRUTE",
    name: "Brute",
    description: "Unstoppable force. +5 Strength",
    icon: "💪",
    color: "bg-red-500",
  },
  {
    value: "ASSASSIN",
    name: "Assassin",
    description: "Swift and precise. +5 Agility",
    icon: "🗡️",
    color: "bg-purple-500",
  },
];

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
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-4 w-4", color)} />
          <span>{label}</span>
        </div>
        <span className="font-medium">{value}</span>
      </div>
      <Progress value={(value / maxValue) * 100} className="h-2" />
    </div>
  );
}

function CharacterCard({ character }: { character: Character }) {
  const stats = (character.stats as CharacterStats) || {
    strength: 10,
    intelligence: 10,
    agility: 10,
    endurance: 10,
  };

  const classInfo = characterClasses.find((c) => c.value === character.class);

  return (
    <Link href={`/characters/${character.id}`}>
      <Card className="group hover:shadow-md transition-all cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "text-3xl p-2 rounded-lg",
                  classInfo?.color,
                  "bg-opacity-20"
                )}
              >
                {classInfo?.icon}
              </div>
              <div>
                <CardTitle className="text-lg">{character.name}</CardTitle>
                <CardDescription>{classInfo?.name}</CardDescription>
              </div>
            </div>
            {character.is_public ? (
              <Globe className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Lock className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            <Progress
              value={(character.health / 100) * 100}
              className="h-2 flex-1"
            />
            <span className="text-sm font-medium">{character.health}/100</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-orange-500" />
              <span>STR: {stats.strength}</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-500" />
              <span>INT: {stats.intelligence}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>AGI: {stats.agility}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-green-500" />
              <span>END: {stats.endurance}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function CreateCharacterDialog() {
  const { isOpen, close } = useCreateCharacterDialogStore();
  const createCharacter = useCreateCharacter();
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(
    null
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !selectedClass) return;

    createCharacter.mutate(
      {
        name: name.trim(),
        class: selectedClass,
        updated_at: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          setName("");
          setSelectedClass(null);
          close();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Character</DialogTitle>
            <DialogDescription>
              Choose a name and class for your new character
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {createCharacter.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {createCharacter.error.message}
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Character Name</Label>
              <Input
                id="name"
                placeholder="Enter character name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={createCharacter.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label>Choose Class</Label>
              <div className="grid grid-cols-1 gap-2">
                {characterClasses.map((charClass) => (
                  <button
                    key={charClass.value}
                    type="button"
                    onClick={() => setSelectedClass(charClass.value)}
                    disabled={createCharacter.isPending}
                    className={cn(
                      "relative flex items-center gap-3 rounded-lg border p-3 text-left transition-all",
                      selectedClass === charClass.value
                        ? "border-primary ring-2 ring-primary"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div
                      className={cn(
                        "text-2xl p-2 rounded-lg bg-opacity-20",
                        charClass.color
                      )}
                    >
                      {charClass.icon}
                    </div>
                    <div>
                      <p className="font-medium">{charClass.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {charClass.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={close}
              disabled={createCharacter.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !name.trim() || !selectedClass || createCharacter.isPending
              }
            >
              {createCharacter.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Character"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function CharactersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { characters } = useCharacterStore();
  const { open } = useCreateCharacterDialogStore();
  const { isLoading } = useUserCharacters();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Swords className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-bold mb-2">Sign in to continue</h2>
            <p className="text-muted-foreground mb-4">
              Create and manage your characters by signing in
            </p>
            <Button asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Characters</h1>
          <p className="text-muted-foreground">
            Manage your heroes and start adventures
          </p>
        </div>
        <Button onClick={open}>
          <Plus className="h-4 w-4 mr-2" />
          New Character
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-14 w-14 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-2 w-full" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : characters.length === 0 ? (
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Swords className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-bold mb-2">No characters yet</h2>
            <p className="text-muted-foreground mb-4">
              Create your first character to begin your adventure
            </p>
            <Button onClick={open}>
              <Plus className="h-4 w-4 mr-2" />
              Create Character
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      )}

      <CreateCharacterDialog />
    </div>
  );
}
