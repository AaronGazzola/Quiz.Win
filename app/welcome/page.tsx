"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/app/layout.stores";
import {
  useCompleteProfile,
  useCreateProfileFromMetadata,
  useWelcomeProfile,
} from "./page.hooks";
import { cn } from "@/lib/utils";

const learningStyles = [
  { id: "visual", label: "Visual", description: "Learn through images and diagrams" },
  { id: "reading", label: "Reading", description: "Learn through text and notes" },
  { id: "kinesthetic", label: "Hands-on", description: "Learn by doing and practicing" },
  { id: "auditory", label: "Auditory", description: "Learn through listening" },
];

const characterClasses = [
  {
    value: "WIZARD",
    name: "Wizard",
    description: "Master of arcane knowledge. Gains bonus XP from quiz streaks.",
    icon: "🧙",
    color: "bg-blue-500",
  },
  {
    value: "BRUTE",
    name: "Brute",
    description: "Unstoppable force. Gains health regen from correct answers.",
    icon: "💪",
    color: "bg-red-500",
  },
  {
    value: "ASSASSIN",
    name: "Assassin",
    description: "Swift and precise. Gains critical hit chance from speed.",
    icon: "🗡️",
    color: "bg-purple-500",
  },
];

export default function WelcomePage() {
  const router = useRouter();
  const { profile, isAuthenticated } = useAuthStore();
  const welcomeProfile = useWelcomeProfile();
  const createProfile = useCreateProfileFromMetadata();
  const completeProfile = useCompleteProfile();

  const [step, setStep] = useState(1);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [previewClass, setPreviewClass] = useState<string | null>(null);

  useEffect(() => {
    if (welcomeProfile.isSuccess && !welcomeProfile.data && !createProfile.isPending && !createProfile.isSuccess) {
      createProfile.mutate();
    }
  }, [welcomeProfile.isSuccess, welcomeProfile.data, createProfile]);

  if (!isAuthenticated) {
    router.push("/sign-in");
    return null;
  }

  if (welcomeProfile.isLoading || createProfile.isPending) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Spinner className="h-8 w-8" />
        <p className="text-muted-foreground">Setting up your profile...</p>
      </div>
    );
  }

  if (createProfile.isError) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to create profile: {createProfile.error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const toggleStyle = (styleId: string) => {
    setSelectedStyles((prev) =>
      prev.includes(styleId)
        ? prev.filter((s) => s !== styleId)
        : [...prev, styleId]
    );
  };

  const handleComplete = () => {
    completeProfile.mutate(
      {
        avatar_url: avatarUrl || null,
        learning_preferences: { styles: selectedStyles },
      },
      {
        onSuccess: () => {
          router.push("/characters");
        },
      }
    );
  };

  const totalSteps = 3;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {profile?.display_name}!
        </h1>
        <p className="text-muted-foreground">
          Let&apos;s set up your profile to personalize your adventure
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-8">
        {[...Array(totalSteps)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 w-16 rounded-full transition-colors",
              i + 1 <= step ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>
              Add a profile picture to personalize your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl || undefined} />
                <AvatarFallback className="text-2xl">
                  {profile?.display_name?.charAt(0).toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="w-full max-w-sm space-y-2">
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input
                  id="avatarUrl"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter a URL to an image, or leave blank to use your initials
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setStep(2)}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Learning Preferences</CardTitle>
            <CardDescription>
              Select how you prefer to learn (choose all that apply)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {learningStyles.map((style) => {
                const isSelected = selectedStyles.includes(style.id);
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => toggleStyle(style.id)}
                    className={cn(
                      "relative flex flex-col items-start gap-1 rounded-lg border p-4 text-left transition-colors",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {isSelected && (
                      <div className="absolute right-2 top-2">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <span className="font-medium">{style.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {style.description}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={() => setStep(3)}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Class</CardTitle>
            <CardDescription>
              Preview the character classes available for your adventures
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {completeProfile.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {completeProfile.error.message}
                </AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {characterClasses.map((charClass) => {
                const isSelected = previewClass === charClass.value;
                return (
                  <button
                    key={charClass.value}
                    type="button"
                    onClick={() => setPreviewClass(charClass.value)}
                    className={cn(
                      "relative overflow-hidden rounded-lg border p-4 text-center transition-all",
                      isSelected
                        ? "border-primary ring-2 ring-primary"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute inset-0 opacity-10",
                        charClass.color
                      )}
                    />
                    <div className="relative">
                      <div className="text-4xl mb-2">{charClass.icon}</div>
                      <div className="font-bold">{charClass.name}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {charClass.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              You&apos;ll create your first character on the next page
            </p>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleComplete}
                disabled={completeProfile.isPending}
              >
                {completeProfile.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Start Adventure
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
