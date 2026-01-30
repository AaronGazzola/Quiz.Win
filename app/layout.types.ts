import type { Database } from "@/supabase/types";
import type { User } from "@supabase/supabase-js";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type Character = Database["public"]["Tables"]["characters"]["Row"];
export type CharacterInsert = Database["public"]["Tables"]["characters"]["Insert"];
export type CharacterUpdate = Database["public"]["Tables"]["characters"]["Update"];
export type CharacterClass = Database["public"]["Enums"]["character_class"];

export type QuizSet = Database["public"]["Tables"]["quiz_sets"]["Row"];
export type QuizSetInsert = Database["public"]["Tables"]["quiz_sets"]["Insert"];
export type QuizSetUpdate = Database["public"]["Tables"]["quiz_sets"]["Update"];
export type QuizSharing = Database["public"]["Enums"]["quiz_sharing"];

export type Question = Database["public"]["Tables"]["questions"]["Row"];
export type QuestionInsert = Database["public"]["Tables"]["questions"]["Insert"];
export type QuestionUpdate = Database["public"]["Tables"]["questions"]["Update"];

export type QuizAttempt = Database["public"]["Tables"]["quiz_attempts"]["Row"];
export type QuizAttemptInsert = Database["public"]["Tables"]["quiz_attempts"]["Insert"];
export type QuizAttemptUpdate = Database["public"]["Tables"]["quiz_attempts"]["Update"];

export type Story = Database["public"]["Tables"]["stories"]["Row"];
export type StoryInsert = Database["public"]["Tables"]["stories"]["Insert"];
export type StoryUpdate = Database["public"]["Tables"]["stories"]["Update"];

export type UserRole = Database["public"]["Enums"]["user_role"];

export type AuthState = {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export type SignInCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = {
  email: string;
  password: string;
  username: string;
  displayName: string;
};

export type CommunityStats = {
  totalUsers: number;
  totalQuizSets: number;
  totalCharacters: number;
  totalCompletions: number;
};

export type RecentCompletion = {
  id: string;
  profile: Pick<Profile, "username" | "display_name" | "avatar_url">;
  quizSet: Pick<QuizSet, "title">;
  score: number;
  completedAt: string;
};

export type QuizSetWithProfile = QuizSet & {
  profile: Pick<Profile, "username" | "display_name" | "avatar_url">;
};

export type CharacterWithProfile = Character & {
  profile: Pick<Profile, "username" | "display_name" | "avatar_url">;
};
