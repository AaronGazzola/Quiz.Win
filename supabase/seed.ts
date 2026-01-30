import type { Database } from "@/supabase/types";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function seed() {
  const testUsers = [
    {
      email: "aaron@gazzola.dev",
      password: "Password123!",
      username: "admin",
      displayName: "Admin User",
      role: "super-admin" as const,
    },
    {
      email: "user1@example.com",
      password: "Password123!",
      username: "alice",
      displayName: "Alice",
      role: "user" as const,
    },
    {
      email: "user2@example.com",
      password: "Password123!",
      username: "bob",
      displayName: "Bob",
      role: "user" as const,
    },
  ];

  const createdProfiles: Array<{
    userId: string;
    profileId: string;
    username: string;
  }> = [];

  for (const userData of testUsers) {
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
      });

    if (authError) {
      console.error(`Error creating user ${userData.email}:`, authError);
      continue;
    }

    if (authData.user) {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .insert({
          user_id: authData.user.id,
          username: userData.username,
          display_name: userData.displayName,
          role: userData.role,
          updated_at: new Date().toISOString(),
          learning_preferences: {},
        })
        .select()
        .single();

      if (profileError) {
        console.error(
          `Error creating profile for ${userData.email}:`,
          profileError
        );
      } else if (profileData) {
        createdProfiles.push({
          userId: authData.user.id,
          profileId: profileData.id,
          username: userData.username,
        });
      }
    }
  }

  if (createdProfiles.length > 0) {
    const aliceProfile = createdProfiles.find((p) => p.username === "alice");

    if (aliceProfile) {
      const { data: quizSetData, error: quizSetError } = await supabase
        .from("quiz_sets")
        .insert({
          user_id: aliceProfile.userId,
          profile_id: aliceProfile.profileId,
          title: "Sample Quiz Set",
          description: "A sample quiz set for testing",
          tags: ["sample", "test"],
          sharing: "PUBLIC",
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (quizSetError) {
        console.error("Error creating quiz set:", quizSetError);
      } else if (quizSetData) {
        const { error: questionsError } = await supabase
          .from("questions")
          .insert([
            {
              quiz_set_id: quizSetData.id,
              user_id: aliceProfile.userId,
              question_text: "What is 2 + 2?",
              correct_answer: "4",
              answers: ["3", "4", "5", "6"],
              difficulty: 1,
              updated_at: new Date().toISOString(),
            },
            {
              quiz_set_id: quizSetData.id,
              user_id: aliceProfile.userId,
              question_text: "What is the capital of France?",
              correct_answer: "Paris",
              answers: ["London", "Paris", "Berlin", "Madrid"],
              difficulty: 1,
              updated_at: new Date().toISOString(),
            },
          ]);

        if (questionsError) {
          console.error("Error creating questions:", questionsError);
        }
      }
    }
  }
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
