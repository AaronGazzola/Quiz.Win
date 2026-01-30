"use server";

import { createClient } from "@/supabase/server-client";
import type {
  QuizSetInsert,
  QuizSetUpdate,
  QuestionInsert,
  QuizAttemptInsert,
  QuizSharing,
} from "@/app/layout.types";

export async function getUserQuizSetsAction() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("quiz_sets")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Failed to fetch quiz sets");
  }

  return data;
}

export async function getQuizSetWithQuestionsAction(quizSetId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: quizSet, error: quizError } = await supabase
    .from("quiz_sets")
    .select("*")
    .eq("id", quizSetId)
    .single();

  if (quizError) {
    console.error(quizError);
    throw new Error("Failed to fetch quiz set");
  }

  if (quizSet.user_id !== user.id && quizSet.sharing === "PRIVATE") {
    throw new Error("Unauthorized");
  }

  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("*")
    .eq("quiz_set_id", quizSetId)
    .order("created_at", { ascending: true });

  if (questionsError) {
    console.error(questionsError);
    throw new Error("Failed to fetch questions");
  }

  return { ...quizSet, questions };
}

export async function createQuizSetAction(
  quizSet: Omit<QuizSetInsert, "user_id" | "profile_id">,
  questions: Omit<QuestionInsert, "user_id" | "quiz_set_id">[]
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile) {
    console.error(profileError);
    throw new Error("Profile not found");
  }

  const { data: newQuizSet, error: quizError } = await supabase
    .from("quiz_sets")
    .insert({
      ...quizSet,
      user_id: user.id,
      profile_id: profile.id,
    })
    .select()
    .single();

  if (quizError) {
    console.error(quizError);
    throw new Error("Failed to create quiz set");
  }

  if (questions.length > 0) {
    const questionsToInsert = questions.map((q) => ({
      ...q,
      user_id: user.id,
      quiz_set_id: newQuizSet.id,
    }));

    const { error: questionsError } = await supabase
      .from("questions")
      .insert(questionsToInsert);

    if (questionsError) {
      console.error(questionsError);
      throw new Error("Failed to create questions");
    }
  }

  return newQuizSet;
}

export async function updateQuizSetAction(
  quizSetId: string,
  updates: QuizSetUpdate
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("quiz_sets")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", quizSetId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to update quiz set");
  }

  return data;
}

export async function deleteQuizSetAction(quizSetId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("quiz_sets")
    .delete()
    .eq("id", quizSetId)
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    throw new Error("Failed to delete quiz set");
  }

  return { success: true };
}

export async function addQuestionAction(
  question: Omit<QuestionInsert, "user_id">
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("questions")
    .insert({
      ...question,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to add question");
  }

  return data;
}

export async function updateQuestionAction(
  questionId: string,
  updates: Partial<QuestionInsert>
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("questions")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", questionId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to update question");
  }

  return data;
}

export async function deleteQuestionAction(questionId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", questionId)
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    throw new Error("Failed to delete question");
  }

  return { success: true };
}

export async function submitQuizAttemptAction(
  attempt: Omit<QuizAttemptInsert, "user_id" | "profile_id">
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile) {
    console.error(profileError);
    throw new Error("Profile not found");
  }

  const { data, error } = await supabase
    .from("quiz_attempts")
    .insert({
      ...attempt,
      user_id: user.id,
      profile_id: profile.id,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to submit quiz attempt");
  }

  return data;
}
