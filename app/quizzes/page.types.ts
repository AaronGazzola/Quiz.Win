import type { QuizSet, Question, QuizSharing } from "@/app/layout.types";

export type QuizSetWithQuestions = QuizSet & {
  questions: Question[];
};

export type QuizSessionState = {
  currentQuestionIndex: number;
  answers: Record<string, string>;
  startTime: number | null;
  isComplete: boolean;
};

export type QuizAnswer = {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeTaken: number;
};

export type QuizResult = {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  answers: QuizAnswer[];
};
