"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Swords,
  BookOpen,
  Play,
  Trophy,
  Scroll,
  Loader2,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/app/layout.stores";
import {
  useCharacterWithStory,
  useCreateStory,
  useAvailableQuizSets,
} from "./page.hooks";
import { cn } from "@/lib/utils";
import type { CharacterStats } from "@/app/characters/page.types";

const characterClasses = {
  WIZARD: { name: "Wizard", icon: "🧙", color: "bg-blue-500" },
  BRUTE: { name: "Brute", icon: "💪", color: "bg-red-500" },
  ASSASSIN: { name: "Assassin", icon: "🗡️", color: "bg-purple-500" },
};

const storyIntros = {
  WIZARD: "You stand at the entrance of the Ancient Library of Arcane Knowledge. Your staff glows faintly as you sense the magical energies within...",
  BRUTE: "The arena gates creak open before you. The roar of the crowd fills your ears as you grip your weapon tighter...",
  ASSASSIN: "Shadows embrace you as you move silently through the moonlit streets. Your target awaits in the tower above...",
};

function QuizSelector({
  onSelect,
}: {
  onSelect: (quizSetId: string) => void;
}) {
  const { data: quizSets, isLoading } = useAvailableQuizSets();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <BookOpen className="h-4 w-4 mr-2" />
          Select a Quiz Challenge
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Choose Your Challenge</DialogTitle>
          <DialogDescription>
            Select a quiz to test your knowledge and earn rewards
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-96">
          {isLoading ? (
            <div className="space-y-3 p-1">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : quizSets?.length ? (
            <div className="space-y-3 p-1">
              {quizSets.map((quizSet) => (
                <Card
                  key={quizSet.id}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => {
                    onSelect(quizSet.id);
                    setOpen(false);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{quizSet.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {quizSet.description}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {quizSet.questionCount} Q
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {quizSet.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No quizzes available</p>
              <Button asChild variant="link" className="mt-2">
                <Link href="/quizzes/create">Create a quiz</Link>
              </Button>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default function AdventurePage({
  params,
}: {
  params: Promise<{ characterId: string }>;
}) {
  const { characterId } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { data, isLoading, error } = useCharacterWithStory(characterId);
  const createStory = useCreateStory();

  if (!isAuthenticated) {
    router.push("/sign-in");
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-8">
                <Skeleton className="h-6 w-full mb-4" />
                <Skeleton className="h-6 w-5/6 mb-4" />
                <Skeleton className="h-6 w-4/6" />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.character) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Swords className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Character not found</p>
            <Button asChild>
              <Link href="/characters">Back to Characters</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { character, story } = data;
  const classInfo = characterClasses[character.class];
  const stats = (character.stats as CharacterStats) || {
    strength: 10,
    intelligence: 10,
    agility: 10,
    endurance: 10,
  };

  const handleStartAdventure = () => {
    createStory.mutate({
      character_id: character.id,
      story_state: {
        chapter: 1,
        progress: 0,
        events: [],
      },
      current_branch: "intro",
      updated_at: new Date().toISOString(),
    });
  };

  const handleQuizSelect = (quizSetId: string) => {
    router.push(`/quizzes?id=${quizSetId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/characters/${character.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Character
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "text-3xl p-3 rounded-xl bg-opacity-20",
                    classInfo.color
                  )}
                >
                  {classInfo.icon}
                </div>
                <div>
                  <CardTitle>{character.name}</CardTitle>
                  <CardDescription>{classInfo.name} Adventure</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {!story ? (
                <div className="text-center py-8">
                  <Scroll className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-bold mb-2">Begin Your Journey</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {storyIntros[character.class]}
                  </p>
                  <Button
                    size="lg"
                    onClick={handleStartAdventure}
                    disabled={createStory.isPending}
                  >
                    {createStory.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Adventure
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-lg">{storyIntros[character.class]}</p>
                    <p>
                      Your journey has begun. Complete quiz challenges to
                      progress through the story and earn rewards for your
                      character.
                    </p>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4">Story Progress</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Chapter 1: The Beginning</span>
                        <span className="text-muted-foreground">
                          Branch: {story.current_branch}
                        </span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4">Next Challenge</h4>
                    <QuizSelector onSelect={handleQuizSelect} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Health</span>
                  <span>{character.health}/100</span>
                </div>
                <Progress
                  value={(character.health / 100) * 100}
                  className="h-3"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">STR</span>
                  <span className="font-medium">{stats.strength}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">INT</span>
                  <span className="font-medium">{stats.intelligence}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">AGI</span>
                  <span className="font-medium">{stats.agility}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">END</span>
                  <span className="font-medium">{stats.endurance}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  Complete quizzes to unlock achievements
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
