"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Play,
  Edit,
  Trash2,
  Globe,
  Lock,
  Link2,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/app/layout.stores";
import {
  useQuizLibraryStore,
  useQuizSessionStore,
} from "./page.stores";
import {
  useUserQuizSets,
  useQuizSetWithQuestions,
  useUpdateQuizSet,
  useDeleteQuizSet,
  useSubmitQuizAttempt,
} from "./page.hooks";
import { cn } from "@/lib/utils";
import type { QuizSharing, Question } from "@/app/layout.types";

const sharingIcons = {
  PRIVATE: Lock,
  PUBLIC: Globe,
  UNLISTED: Link2,
};

const sharingLabels = {
  PRIVATE: "Private",
  PUBLIC: "Public",
  UNLISTED: "Unlisted",
};

function QuizLibrarySidebar() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { quizSets, selectedQuizSetId, selectQuizSet } = useQuizLibraryStore();
  const { data, isLoading } = useUserQuizSets();

  if (!isAuthenticated) {
    return (
      <Card className="h-full">
        <CardContent className="p-6 text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">
            Sign in to view your quiz library
          </p>
          <Button asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">My Quizzes</CardTitle>
          <Button asChild size="sm">
            <Link href="/quizzes/create">
              <Plus className="h-4 w-4 mr-1" />
              New
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : quizSets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-4">
              No quiz sets yet
            </p>
            <Button asChild size="sm" variant="outline">
              <Link href="/quizzes/create">Create your first quiz</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            {quizSets.map((quizSet) => {
              const SharingIcon = sharingIcons[quizSet.sharing];
              const isSelected = selectedQuizSetId === quizSet.id;
              return (
                <button
                  key={quizSet.id}
                  onClick={() => selectQuizSet(quizSet.id)}
                  className={cn(
                    "w-full text-left rounded-lg p-3 transition-colors",
                    isSelected
                      ? "bg-primary/10 border border-primary"
                      : "hover:bg-muted border border-transparent"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {quizSet.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {quizSet.description}
                      </p>
                    </div>
                    <SharingIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function QuizDetail() {
  const router = useRouter();
  const { selectedQuizSetId, selectQuizSet } = useQuizLibraryStore();
  const { session, startSession, resetSession } = useQuizSessionStore();
  const { data: quizSet, isLoading } = useQuizSetWithQuestions(selectedQuizSetId);
  const updateQuizSet = useUpdateQuizSet();
  const deleteQuizSet = useDeleteQuizSet();

  const handleSharingChange = (value: QuizSharing) => {
    if (selectedQuizSetId) {
      updateQuizSet.mutate({
        quizSetId: selectedQuizSetId,
        updates: { sharing: value },
      });
    }
  };

  const handleDelete = () => {
    if (selectedQuizSetId) {
      deleteQuizSet.mutate(selectedQuizSetId, {
        onSuccess: () => {
          selectQuizSet(null);
        },
      });
    }
  };

  if (!selectedQuizSetId) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center p-8">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Select a quiz</h3>
          <p className="text-muted-foreground">
            Choose a quiz from your library to view details and start a session
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!quizSet) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center p-8">
          <p className="text-muted-foreground">Quiz set not found</p>
        </CardContent>
      </Card>
    );
  }

  if (session) {
    return (
      <QuizSession
        quizSet={quizSet}
        questions={quizSet.questions}
        onClose={resetSession}
      />
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-2xl">{quizSet.title}</CardTitle>
            <CardDescription className="mt-2">
              {quizSet.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={quizSet.sharing}
              onValueChange={handleSharingChange}
              disabled={updateQuizSet.isPending}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRIVATE">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Private
                  </div>
                </SelectItem>
                <SelectItem value="PUBLIC">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Public
                  </div>
                </SelectItem>
                <SelectItem value="UNLISTED">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    Unlisted
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {quizSet.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">
            Questions ({quizSet.questions.length})
          </h3>
          <Button
            onClick={startSession}
            disabled={quizSet.questions.length === 0}
          >
            <Play className="h-4 w-4 mr-2" />
            Start Quiz
          </Button>
        </div>
        {quizSet.questions.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-muted-foreground mb-4">No questions yet</p>
            <Button asChild variant="outline" size="sm">
              <Link href={`/quizzes/create?edit=${quizSet.id}`}>
                Add questions
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {quizSet.questions.map((question, index) => (
              <div
                key={question.id}
                className="border rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    {index + 1}.
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{question.question_text}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Answer: {question.correct_answer}
                    </p>
                  </div>
                  <Badge variant="outline">
                    Difficulty: {question.difficulty}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <div className="border-t p-4 flex justify-between">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete quiz set?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete &quot;{quizSet.title}&quot; and all
                its questions. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button asChild variant="outline" size="sm">
          <Link href={`/quizzes/create?edit=${quizSet.id}`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
      </div>
    </Card>
  );
}

function QuizSession({
  quizSet,
  questions,
  onClose,
}: {
  quizSet: { id: string; title: string };
  questions: Question[];
  onClose: () => void;
}) {
  const {
    session,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    completeSession,
  } = useQuizSessionStore();
  const submitAttempt = useSubmitQuizAttempt();

  if (!session) return null;

  const currentQuestion = questions[session.currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((session.currentQuestionIndex + 1) / totalQuestions) * 100;
  const currentAnswer = session.answers[currentQuestion?.id];

  const answers = currentQuestion
    ? (currentQuestion.answers as string[])
    : [];

  const handleSubmit = () => {
    const correctCount = questions.filter(
      (q) => session.answers[q.id] === q.correct_answer
    ).length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    submitAttempt.mutate({
      quiz_set_id: quizSet.id,
      score,
      answers: session.answers,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  };

  if (session.isComplete) {
    const correctCount = questions.filter(
      (q) => session.answers[q.id] === q.correct_answer
    ).length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
          <CardDescription>{quizSet.title}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center">
          <div className="text-6xl font-bold text-primary mb-4">{score}%</div>
          <p className="text-lg text-muted-foreground mb-8">
            {correctCount} of {totalQuestions} correct
          </p>
          <div className="w-full max-w-md space-y-3">
            {questions.map((question, index) => {
              const userAnswer = session.answers[question.id];
              const isCorrect = userAnswer === question.correct_answer;
              return (
                <div
                  key={question.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border",
                    isCorrect
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-red-500/10 border-red-500/30"
                  )}
                >
                  {isCorrect ? (
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {index + 1}. {question.question_text}
                    </p>
                    {!isCorrect && (
                      <p className="text-xs text-muted-foreground">
                        Correct: {question.correct_answer}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
        <div className="border-t p-4 flex justify-center gap-4">
          <Button variant="outline" onClick={onClose}>
            Back to Library
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitAttempt.isPending}
          >
            {submitAttempt.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Result"
            )}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg">{quizSet.title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Question {session.currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1">
          <h2 className="text-xl font-medium mb-6">
            {currentQuestion?.question_text}
          </h2>
          <div className="space-y-3">
            {answers.map((answer) => (
              <button
                key={answer}
                onClick={() => answerQuestion(currentQuestion.id, answer)}
                className={cn(
                  "w-full text-left p-4 rounded-lg border transition-colors",
                  currentAnswer === answer
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                {answer}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
      <div className="border-t p-4 flex justify-between">
        <Button
          variant="outline"
          onClick={previousQuestion}
          disabled={session.currentQuestionIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        {session.currentQuestionIndex === totalQuestions - 1 ? (
          <Button onClick={completeSession} disabled={!currentAnswer}>
            Finish
          </Button>
        ) : (
          <Button onClick={nextQuestion} disabled={!currentAnswer}>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </Card>
  );
}

function QuizzesPageContent() {
  const searchParams = useSearchParams();
  const { selectQuizSet } = useQuizLibraryStore();

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      selectQuizSet(id);
    }
  }, [searchParams, selectQuizSet]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        <div className="lg:col-span-1">
          <QuizLibrarySidebar />
        </div>
        <div className="lg:col-span-2">
          <QuizDetail />
        </div>
      </div>
    </div>
  );
}

export default function QuizzesPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8"><Skeleton className="h-96 w-full" /></div>}>
      <QuizzesPageContent />
    </Suspense>
  );
}
