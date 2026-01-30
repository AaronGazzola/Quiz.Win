import { create } from "zustand";
import type { QuizSet } from "@/app/layout.types";
import type { QuizSessionState } from "./page.types";

type QuizLibraryStore = {
  quizSets: QuizSet[];
  selectedQuizSetId: string | null;
  setQuizSets: (quizSets: QuizSet[]) => void;
  selectQuizSet: (id: string | null) => void;
  addQuizSet: (quizSet: QuizSet) => void;
  updateQuizSet: (id: string, updates: Partial<QuizSet>) => void;
  removeQuizSet: (id: string) => void;
};

export const useQuizLibraryStore = create<QuizLibraryStore>((set) => ({
  quizSets: [],
  selectedQuizSetId: null,
  setQuizSets: (quizSets) => set({ quizSets }),
  selectQuizSet: (id) => set({ selectedQuizSetId: id }),
  addQuizSet: (quizSet) =>
    set((state) => ({ quizSets: [quizSet, ...state.quizSets] })),
  updateQuizSet: (id, updates) =>
    set((state) => ({
      quizSets: state.quizSets.map((qs) =>
        qs.id === id ? { ...qs, ...updates } : qs
      ),
    })),
  removeQuizSet: (id) =>
    set((state) => ({
      quizSets: state.quizSets.filter((qs) => qs.id !== id),
      selectedQuizSetId:
        state.selectedQuizSetId === id ? null : state.selectedQuizSetId,
    })),
}));

type QuizSessionStore = {
  session: QuizSessionState | null;
  startSession: () => void;
  answerQuestion: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  completeSession: () => void;
  resetSession: () => void;
};

export const useQuizSessionStore = create<QuizSessionStore>((set) => ({
  session: null,
  startSession: () =>
    set({
      session: {
        currentQuestionIndex: 0,
        answers: {},
        startTime: Date.now(),
        isComplete: false,
      },
    }),
  answerQuestion: (questionId, answer) =>
    set((state) => ({
      session: state.session
        ? {
            ...state.session,
            answers: { ...state.session.answers, [questionId]: answer },
          }
        : null,
    })),
  nextQuestion: () =>
    set((state) => ({
      session: state.session
        ? {
            ...state.session,
            currentQuestionIndex: state.session.currentQuestionIndex + 1,
          }
        : null,
    })),
  previousQuestion: () =>
    set((state) => ({
      session: state.session
        ? {
            ...state.session,
            currentQuestionIndex: Math.max(
              0,
              state.session.currentQuestionIndex - 1
            ),
          }
        : null,
    })),
  completeSession: () =>
    set((state) => ({
      session: state.session
        ? { ...state.session, isComplete: true }
        : null,
    })),
  resetSession: () => set({ session: null }),
}));
