import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Quiz } from "@/types/quiz";
import { getGradeMessage } from "../utils/grading";

interface QuizResultProps {
  quiz: Quiz;
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export function QuizResult({
  quiz,
  score,
  totalQuestions,
  onRestart,
}: QuizResultProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const grade = getGradeMessage(percentage);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="text-center">
        <CardHeader className="space-y-4 pb-8">
          <div className="text-6xl mb-2">{grade.emoji}</div>
          <CardTitle className="text-3xl">{grade.message}</CardTitle>
          <CardDescription className="text-lg">
            You've completed the {quiz.title} quiz
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Circle */}
          <div className="flex justify-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-secondary"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - percentage / 100)}`}
                  className={`${grade.color} transition-all duration-1000 ease-out`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-4xl font-bold ${grade.color}`}>
                  {percentage}%
                </div>
                <div className="text-sm text-muted-foreground">
                  {score}/{totalQuestions}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-red-600">
                {totalQuestions - score}
              </div>
              <div className="text-sm text-muted-foreground">Wrong</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold">{totalQuestions}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <Button onClick={onRestart} size="lg" className="w-full">
              Try Another Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
