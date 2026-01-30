import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Quiz } from "@/types/quiz";

interface QuizSelectionProps {
  quizzes: Quiz[];
  onSelectQuiz: (quiz: Quiz) => void;
}

export function QuizSelection({ quizzes, onSelectQuiz }: QuizSelectionProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl font-bold">Quiz App</h1>
        <p className="text-muted-foreground text-lg">
          Choose a quiz to test your knowledge
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{quiz.title}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{quiz.questions.length} questions</span>
                <span>~{quiz.questions.length * 1} min</span>
              </div>
              <Button onClick={() => onSelectQuiz(quiz)} className="w-full">
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
