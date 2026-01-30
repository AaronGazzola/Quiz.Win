"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useQuizLibraryStore, useQuizSessionStore } from "./page.stores";
import {
  getUserQuizSetsAction,
  getQuizSetWithQuestionsAction,
  createQuizSetAction,
  updateQuizSetAction,
  deleteQuizSetAction,
  addQuestionAction,
  updateQuestionAction,
  deleteQuestionAction,
  submitQuizAttemptAction,
} from "./page.actions";
import type {
  QuizSetInsert,
  QuizSetUpdate,
  QuestionInsert,
  QuizAttemptInsert,
} from "@/app/layout.types";

export function useUserQuizSets() {
  const { setQuizSets } = useQuizLibraryStore();

  return useQuery({
    queryKey: ["userQuizSets"],
    queryFn: async () => {
      const quizSets = await getUserQuizSetsAction();
      setQuizSets(quizSets);
      return quizSets;
    },
  });
}

export function useQuizSetWithQuestions(quizSetId: string | null) {
  return useQuery({
    queryKey: ["quizSet", quizSetId],
    queryFn: () => getQuizSetWithQuestionsAction(quizSetId!),
    enabled: !!quizSetId,
  });
}

export function useCreateQuizSet() {
  const queryClient = useQueryClient();
  const { addQuizSet } = useQuizLibraryStore();

  return useMutation({
    mutationFn: ({
      quizSet,
      questions,
    }: {
      quizSet: Omit<QuizSetInsert, "user_id" | "profile_id">;
      questions: Omit<QuestionInsert, "user_id" | "quiz_set_id">[];
    }) => createQuizSetAction(quizSet, questions),
    onSuccess: (newQuizSet) => {
      addQuizSet(newQuizSet);
      queryClient.invalidateQueries({ queryKey: ["userQuizSets"] });
    },
  });
}

export function useUpdateQuizSet() {
  const queryClient = useQueryClient();
  const { updateQuizSet } = useQuizLibraryStore();

  return useMutation({
    mutationFn: ({
      quizSetId,
      updates,
    }: {
      quizSetId: string;
      updates: QuizSetUpdate;
    }) => updateQuizSetAction(quizSetId, updates),
    onSuccess: (updatedQuizSet) => {
      updateQuizSet(updatedQuizSet.id, updatedQuizSet);
      queryClient.invalidateQueries({ queryKey: ["userQuizSets"] });
      queryClient.invalidateQueries({
        queryKey: ["quizSet", updatedQuizSet.id],
      });
    },
  });
}

export function useDeleteQuizSet() {
  const queryClient = useQueryClient();
  const { removeQuizSet } = useQuizLibraryStore();

  return useMutation({
    mutationFn: (quizSetId: string) => deleteQuizSetAction(quizSetId),
    onSuccess: (_, quizSetId) => {
      removeQuizSet(quizSetId);
      queryClient.invalidateQueries({ queryKey: ["userQuizSets"] });
    },
  });
}

export function useAddQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (question: Omit<QuestionInsert, "user_id">) =>
      addQuestionAction(question),
    onSuccess: (newQuestion) => {
      queryClient.invalidateQueries({
        queryKey: ["quizSet", newQuestion.quiz_set_id],
      });
    },
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionId,
      updates,
    }: {
      questionId: string;
      updates: Partial<QuestionInsert>;
    }) => updateQuestionAction(questionId, updates),
    onSuccess: (updatedQuestion) => {
      queryClient.invalidateQueries({
        queryKey: ["quizSet", updatedQuestion.quiz_set_id],
      });
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionId,
      quizSetId,
    }: {
      questionId: string;
      quizSetId: string;
    }) => deleteQuestionAction(questionId),
    onSuccess: (_, { quizSetId }) => {
      queryClient.invalidateQueries({ queryKey: ["quizSet", quizSetId] });
    },
  });
}

export function useSubmitQuizAttempt() {
  const queryClient = useQueryClient();
  const { resetSession } = useQuizSessionStore();

  return useMutation({
    mutationFn: (attempt: Omit<QuizAttemptInsert, "user_id" | "profile_id">) =>
      submitQuizAttemptAction(attempt),
    onSuccess: () => {
      resetSession();
      queryClient.invalidateQueries({ queryKey: ["recentCompletions"] });
    },
  });
}
