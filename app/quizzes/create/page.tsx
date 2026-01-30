"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/app/layout.stores";
import { useCreateQuizSet } from "./page.hooks";
import type { QuizSharing } from "@/app/layout.types";

type QuestionForm = {
  id: string;
  question_text: string;
  correct_answer: string;
  answers: string[];
  difficulty: number;
};

export default function CreateQuizPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const createQuizSet = useCreateQuizSet();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [sharing, setSharing] = useState<QuizSharing>("PRIVATE");
  const [questions, setQuestions] = useState<QuestionForm[]>([
    {
      id: crypto.randomUUID(),
      question_text: "",
      correct_answer: "",
      answers: ["", "", "", ""],
      difficulty: 1,
    },
  ]);

  if (!isAuthenticated) {
    router.push("/sign-in");
    return null;
  }

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: crypto.randomUUID(),
        question_text: "",
        correct_answer: "",
        answers: ["", "", "", ""],
        difficulty: 1,
      },
    ]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const updateQuestion = (id: string, updates: Partial<QuestionForm>) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const updateAnswer = (questionId: string, index: number, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newAnswers = [...q.answers];
          newAnswers[index] = value;
          return { ...q, answers: newAnswers };
        }
        return q;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validQuestions = questions
      .filter(
        (q) =>
          q.question_text.trim() &&
          q.correct_answer.trim() &&
          q.answers.filter((a) => a.trim()).length >= 2
      )
      .map((q) => ({
        question_text: q.question_text.trim(),
        correct_answer: q.correct_answer.trim(),
        answers: q.answers.filter((a) => a.trim()),
        difficulty: q.difficulty,
        updated_at: new Date().toISOString(),
      }));

    createQuizSet.mutate(
      {
        quizSet: {
          title: title.trim(),
          description: description.trim(),
          tags,
          sharing,
          updated_at: new Date().toISOString(),
        },
        questions: validQuestions,
      },
      {
        onSuccess: (newQuizSet) => {
          router.push(`/quizzes?id=${newQuizSet.id}`);
        },
      }
    );
  };

  const isValid =
    title.trim() &&
    description.trim() &&
    questions.some(
      (q) =>
        q.question_text.trim() &&
        q.correct_answer.trim() &&
        q.answers.filter((a) => a.trim()).length >= 2
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/quizzes">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quizzes
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create Quiz Set</CardTitle>
            <CardDescription>
              Add a title, description, and questions to your quiz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {createQuizSet.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {createQuizSet.error.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter quiz title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your quiz"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Visibility</Label>
              <Select
                value={sharing}
                onValueChange={(value) => setSharing(value as QuizSharing)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRIVATE">Private - Only you</SelectItem>
                  <SelectItem value="PUBLIC">
                    Public - Visible to everyone
                  </SelectItem>
                  <SelectItem value="UNLISTED">
                    Unlisted - Anyone with link
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">
              Questions ({questions.length})
            </h2>
            <Button type="button" variant="outline" onClick={addQuestion}>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>

          {questions.map((question, qIndex) => (
            <Card key={question.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Question {qIndex + 1}
                  </CardTitle>
                  {questions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Question</Label>
                  <Textarea
                    placeholder="Enter your question"
                    value={question.question_text}
                    onChange={(e) =>
                      updateQuestion(question.id, {
                        question_text: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Answer Options</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {question.answers.map((answer, aIndex) => (
                      <Input
                        key={aIndex}
                        placeholder={`Option ${aIndex + 1}`}
                        value={answer}
                        onChange={(e) =>
                          updateAnswer(question.id, aIndex, e.target.value)
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Correct Answer</Label>
                    <Select
                      value={question.correct_answer}
                      onValueChange={(value) =>
                        updateQuestion(question.id, { correct_answer: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        {question.answers
                          .filter((a) => a.trim())
                          .map((answer) => (
                            <SelectItem key={answer} value={answer}>
                              {answer}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Difficulty (1-5)</Label>
                    <Select
                      value={question.difficulty.toString()}
                      onValueChange={(value) =>
                        updateQuestion(question.id, {
                          difficulty: parseInt(value),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((d) => (
                          <SelectItem key={d} value={d.toString()}>
                            {d} - {["Easy", "Normal", "Medium", "Hard", "Expert"][d - 1]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button asChild variant="outline">
            <Link href="/quizzes">Cancel</Link>
          </Button>
          <Button type="submit" disabled={!isValid || createQuizSet.isPending}>
            {createQuizSet.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Quiz"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
