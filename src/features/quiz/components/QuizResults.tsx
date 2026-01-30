import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  Home,
  Lightbulb,
} from "lucide-react";
import type { QuizResult } from "@/types/quiz";

export function QuizResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result as QuizResult | undefined;

  if (!result) {
    navigate("/quizzes");
    return null;
  }

  const percentageScore = Math.round(result.percentage);
  const isPassed = percentageScore >= 70;

  const getScoreColor = () => {
    if (percentageScore >= 90) return "text-green-600";
    if (percentageScore >= 70) return "text-blue-600";
    if (percentageScore >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = () => {
    if (percentageScore >= 90) return "Outstanding! 🎉";
    if (percentageScore >= 70) return "Great job! 👏";
    if (percentageScore >= 50) return "Good effort! 💪";
    return "Keep practicing! 📚";
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Score Summary */}
        <Card className="border-2">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className={`w-10 h-10 ${getScoreColor()}`} />
            </div>
            <div>
              <CardTitle className="text-3xl">{getScoreMessage()}</CardTitle>
              <CardDescription className="text-lg mt-2">
                You scored {result.score} out of {result.totalQuestions}
              </CardDescription>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className={`text-5xl font-bold ${getScoreColor()}`}>
                {percentageScore}%
              </div>
              <Badge
                variant={isPassed ? "default" : "destructive"}
                className="text-lg px-4 py-1"
              >
                {isPassed ? "Passed" : "Failed"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate(`/quiz/${result.quizId}`)}
              variant="outline"
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </Button>
            <Button onClick={() => navigate("/quizzes")} className="gap-2">
              <Home className="w-4 h-4" />
              Back to Quizzes
            </Button>
          </CardContent>
        </Card>

        {/* Question Review */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Question Review</h2>
          {result.questionResults.map((qResult, index) => {
            const isCorrect = qResult.isCorrect;
            return (
              <Card
                key={qResult.questionId}
                className={`border-2 ${isCorrect ? "border-green-200" : "border-red-200"}`}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        Question {index + 1}
                      </CardTitle>
                      <CardDescription className="mt-2 text-base text-foreground">
                        {qResult.questionText}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Answer Status */}
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        Your answer:
                      </span>
                      <Badge
                        variant={isCorrect ? "default" : "destructive"}
                        className="font-normal"
                      >
                        Option {qResult.selectedOptionIndex + 1}
                      </Badge>
                    </div>
                    {!isCorrect && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          Correct answer:
                        </span>
                        <Badge variant="default" className="font-normal">
                          Option {qResult.correctOptionIndex + 1}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Explanation */}
                  {qResult.explanation && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                        Explanation:
                      </p>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {qResult.explanation}
                      </p>
                    </div>
                  )}

                  {/* Hint (if available) */}
                  {qResult.hint && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
                            Hint:
                          </p>
                          <p className="text-sm text-amber-800 dark:text-amber-200">
                            {qResult.hint}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="flex gap-4 justify-center pb-8">
          <Button
            onClick={() => navigate(`/quiz/${result.quizId}`)}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </Button>
          <Button
            onClick={() => navigate("/quizzes")}
            size="lg"
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            All Quizzes
          </Button>
        </div>
      </div>
    </div>
  );
}
