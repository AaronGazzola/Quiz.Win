"use client";

import Link from "next/link";
import { BookOpen, Swords, Users, Trophy, ArrowRight } from "lucide-react";
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
import { useAuthStore } from "./layout.stores";
import { useHomePageData } from "./page.hooks";
import { cn } from "@/lib/utils";

const characterClasses = [
  {
    name: "Wizard",
    value: "WIZARD",
    description: "Master of arcane knowledge",
    color: "bg-blue-500",
    icon: "🧙",
  },
  {
    name: "Brute",
    value: "BRUTE",
    description: "Unstoppable force of nature",
    color: "bg-red-500",
    icon: "💪",
  },
  {
    name: "Assassin",
    value: "ASSASSIN",
    description: "Swift and precise striker",
    color: "bg-purple-500",
    icon: "🗡️",
  },
];

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
    <Card className="group hover:shadow-md transition-shadow">
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
  );
}

function CharacterClassCard({
  characterClass,
}: {
  characterClass: (typeof characterClasses)[0];
}) {
  return (
    <Card className="relative overflow-hidden group hover:shadow-md transition-shadow">
      <div
        className={cn(
          "absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20",
          characterClass.color
        )}
      />
      <CardContent className="relative p-6 text-center">
        <div className="text-5xl mb-3">{characterClass.icon}</div>
        <h3 className="font-bold text-lg mb-1">{characterClass.name}</h3>
        <p className="text-sm text-muted-foreground">
          {characterClass.description}
        </p>
      </CardContent>
    </Card>
  );
}

function CompletionItem({
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
    <div className="flex items-center gap-3 py-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={completion.profile.avatar_url ?? undefined} />
        <AvatarFallback className="text-xs">
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
      <Badge variant="secondary" className="shrink-0">
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

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const { communityStats, popularQuizSets, recentCompletions, isLoading } =
    useHomePageData();

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Master Your Knowledge Through Adventure
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Create quizzes, build characters, and embark on learning adventures.
          Join a community of knowledge seekers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <>
              <Button asChild size="lg">
                <Link href="/quizzes">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Build Quiz Library
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/characters">
                  <Swords className="mr-2 h-5 w-5" />
                  Start Adventure
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild size="lg">
                <Link href="/sign-up">Get Started Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/community">Explore Community</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Choose Your Class</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {characterClasses.map((characterClass) => (
            <CharacterClassCard
              key={characterClass.value}
              characterClass={characterClass}
            />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Community Stats</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            icon={Users}
            label="Adventurers"
            value={communityStats.data?.totalUsers ?? 0}
            isLoading={communityStats.isLoading}
          />
          <StatsCard
            icon={BookOpen}
            label="Quiz Sets"
            value={communityStats.data?.totalQuizSets ?? 0}
            isLoading={communityStats.isLoading}
          />
          <StatsCard
            icon={Swords}
            label="Characters"
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
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Popular Quiz Sets</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/community">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {popularQuizSets.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularQuizSets.data.map((quizSet) => (
                <Link key={quizSet.id} href={`/quizzes?id=${quizSet.id}`}>
                  <QuizSetCard quizSet={quizSet as any} />
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No quiz sets yet. Be the first to create one!
                </p>
                <Button asChild className="mt-4">
                  <Link href="/quizzes/create">Create Quiz Set</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Activity</h2>
          </div>
          <Card>
            <CardContent className="p-4">
              {recentCompletions.isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-5 w-12" />
                    </div>
                  ))}
                </div>
              ) : recentCompletions.data?.length ? (
                <div className="divide-y">
                  {recentCompletions.data.map((completion) => (
                    <CompletionItem
                      key={completion.id}
                      completion={completion as any}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No completions yet. Start your adventure!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
