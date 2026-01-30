"use client";

import Link from "next/link";
import {
  Users,
  BookOpen,
  Swords,
  Trophy,
  TrendingUp,
  Clock,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCommunityData } from "./page.hooks";
import { cn } from "@/lib/utils";

const characterClasses = {
  WIZARD: { name: "Wizard", icon: "🧙", color: "bg-blue-500" },
  BRUTE: { name: "Brute", icon: "💪", color: "bg-red-500" },
  ASSASSIN: { name: "Assassin", icon: "🗡️", color: "bg-purple-500" },
};

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

function QuizSetCard({
  quizSet,
}: {
  quizSet: {
    id: string;
    title: string;
    description: string;
    tags: string[];
    profile: { username: string; display_name: string; avatar_url: string | null };
  };
}) {
  return (
    <Link href={`/quizzes?id=${quizSet.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg line-clamp-1">{quizSet.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {quizSet.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1 mb-3">
            {quizSet.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={quizSet.profile.avatar_url ?? undefined} />
              <AvatarFallback className="text-xs">
                {quizSet.profile.display_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              @{quizSet.profile.username}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function CharacterCard({
  character,
}: {
  character: {
    id: string;
    name: string;
    class: "WIZARD" | "BRUTE" | "ASSASSIN";
    health: number;
    profile: { username: string; display_name: string; avatar_url: string | null };
  };
}) {
  const classInfo = characterClasses[character.class];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "text-2xl p-2 rounded-lg bg-opacity-20",
              classInfo.color
            )}
          >
            {classInfo.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{character.name}</p>
            <p className="text-sm text-muted-foreground">{classInfo.name}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Avatar className="h-5 w-5">
            <AvatarImage src={character.profile.avatar_url ?? undefined} />
            <AvatarFallback className="text-xs">
              {character.profile.display_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">
            @{character.profile.username}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityItem({
  completion,
}: {
  completion: {
    id: string;
    profile: { username: string; display_name: string; avatar_url: string | null };
    quizSet: { title: string };
    score: number;
    completedAt: string;
  };
}) {
  const timeAgo = getTimeAgo(new Date(completion.completedAt));

  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-0">
      <Avatar className="h-10 w-10">
        <AvatarImage src={completion.profile.avatar_url ?? undefined} />
        <AvatarFallback>
          {completion.profile.display_name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-medium">{completion.profile.display_name}</span>
          {" completed "}
          <span className="font-medium">{completion.quizSet.title}</span>
        </p>
        <p className="text-xs text-muted-foreground">{timeAgo}</p>
      </div>
      <Badge variant={completion.score >= 80 ? "default" : "secondary"}>
        {completion.score}%
      </Badge>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function CommunityPage() {
  const { communityStats, popularQuizSets, featuredCharacters, recentCompletions } =
    useCommunityData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Community</h1>
        <p className="text-muted-foreground">
          Discover quizzes, characters, and activity from the community
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          icon={Users}
          label="Adventurers"
          value={communityStats.data?.totalUsers ?? 0}
          isLoading={communityStats.isLoading}
        />
        <StatsCard
          icon={BookOpen}
          label="Public Quizzes"
          value={communityStats.data?.totalQuizSets ?? 0}
          isLoading={communityStats.isLoading}
        />
        <StatsCard
          icon={Swords}
          label="Public Characters"
          value={communityStats.data?.totalCharacters ?? 0}
          isLoading={communityStats.isLoading}
        />
        <StatsCard
          icon={Trophy}
          label="Completions"
          value={communityStats.data?.totalCompletions ?? 0}
          isLoading={communityStats.isLoading}
        />
      </div>

      <Tabs defaultValue="quizzes" className="space-y-6">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="quizzes" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Quizzes</span>
          </TabsTrigger>
          <TabsTrigger value="characters" className="flex items-center gap-2">
            <Swords className="h-4 w-4" />
            <span className="hidden sm:inline">Characters</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quizzes">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Trending Quizzes</h2>
          </div>
          {popularQuizSets.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-3">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-1 mb-3">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-12" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : popularQuizSets.data?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularQuizSets.data.map((quizSet) => (
                <QuizSetCard key={quizSet.id} quizSet={quizSet as any} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No public quizzes yet. Be the first to share one!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="characters">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Featured Characters</h2>
          </div>
          {featuredCharacters.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredCharacters.data?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredCharacters.data.map((character) => (
                <CharacterCard key={character.id} character={character as any} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Swords className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No public characters yet. Share yours with the community!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Activity</h2>
          </div>
          <Card>
            <CardContent className="p-4">
              {recentCompletions.isLoading ? (
                <div className="space-y-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 py-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-5 w-12" />
                    </div>
                  ))}
                </div>
              ) : recentCompletions.data?.length ? (
                <div>
                  {recentCompletions.data.map((completion) => (
                    <ActivityItem
                      key={completion.id}
                      completion={completion as any}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No activity yet. Complete a quiz to show up here!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
