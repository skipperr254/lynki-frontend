import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Quiz as QuizType, QuizAnswer } from "@/types/quiz";
import { useQuiz } from "../hooks/useQuiz";
import { useState, useEffect } from "react";
import { Lightbulb } from "lucide-react";

interface QuizProps {
  quiz: QuizType;
  onComplete: (score: number, answers: QuizAnswer[]) => void;
  onExit: () => void;
}

export function Quiz({ quiz, onComplete, onExit }: QuizProps) {
  const {
    currentQuestionIndex,
    selectedOption,
    answeredQuestions,
    progress,
    isFirstQuestion,
    isLastQuestion,
    handleOptionSelect,
    handleNext,
    handlePrevious,
  } = useQuiz(quiz, onComplete);

  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const showFeedback = answeredQuestions.has(currentQuestion.id);

  useEffect(() => {
    setShowHint(false);
  }, [currentQuestionIndex]);

  const handleOptionClick = (index: number) => {
    handleOptionSelect(index);
  };

  const handleContinue = () => {
    handleNext();
  };

  const handleGoBack = () => {
    handlePrevious();
  };

  const handleExitClick = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    onExit();
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
  };

  const isCorrect = selectedOption === currentQuestion.correctAnswer;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Exit Quiz?</CardTitle>
              <CardDescription>
                Your progress will not be saved. Are you sure you want to exit?
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3 justify-end">
              <Button variant="outline" onClick={cancelExit}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmExit}>
                Exit Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header with Exit Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{quiz.title}</h2>
        <Button variant="ghost" onClick={handleExitClick}>
          Exit Quiz
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1.5">
              <CardTitle className="text-2xl">
                {currentQuestion.question}
              </CardTitle>
              <CardDescription>Select one answer</CardDescription>
            </div>
            {currentQuestion.hint && !showFeedback && (
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 text-muted-foreground hover:text-primary"
                onClick={() => setShowHint(!showHint)}
              >
                <Lightbulb
                  className={`w-4 h-4 mr-2 ${showHint ? "fill-current" : ""}`}
                />
                {showHint ? "Hide Hint" : "Hint"}
              </Button>
            )}
          </div>
          {showHint && !showFeedback && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg text-sm text-foreground/80 border border-border animate-in fade-in slide-in-from-top-2">
              <span className="font-semibold mr-1 text-primary">Hint:</span>
              {currentQuestion.hint}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrectAnswer = index === currentQuestion.correctAnswer;
            const showCorrect = showFeedback && isCorrectAnswer;
            const showIncorrect = showFeedback && isSelected && !isCorrect;
            const shouldShowExplanation =
              showFeedback && (isSelected || (isCorrectAnswer && !isCorrect));

            return (
              <div key={index}>
                <button
                  onClick={() => !showFeedback && handleOptionClick(index)}
                  disabled={showFeedback}
                  className={`w-full text-left p-4 transition-all ${
                    showCorrect
                      ? "bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-900/50"
                      : showIncorrect
                        ? "bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900/50"
                        : isSelected
                          ? "border-2 border-primary bg-primary/5"
                          : "border-2 border-border hover:border-primary/50 hover:bg-accent/50"
                  } ${showFeedback ? "cursor-not-allowed" : ""} ${
                    shouldShowExplanation
                      ? "rounded-t-lg border-b-0 pb-2"
                      : "rounded-lg"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        showCorrect
                          ? "border-green-400 dark:border-green-600 bg-green-100 dark:bg-green-900/40"
                          : showIncorrect
                            ? "border-red-400 dark:border-red-600 bg-red-100 dark:bg-red-900/40"
                            : isSelected
                              ? "border-primary bg-primary"
                              : "border-border"
                      }`}
                    >
                      {showCorrect && (
                        <svg
                          className="w-3.5 h-3.5 text-green-600 dark:text-green-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                      {showIncorrect && (
                        <svg
                          className="w-3.5 h-3.5 text-red-600 dark:text-red-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                      {!showFeedback && isSelected && (
                        <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                      )}
                    </div>
                    <span className="flex-1">{option}</span>
                  </div>
                </button>

                {/* Inline Explanation */}
                {shouldShowExplanation && (
                  <div
                    className={`p-4 pt-2 ${
                      isCorrectAnswer
                        ? "bg-green-50 dark:bg-green-950/20 border-2 border-t-0 border-green-200 dark:border-green-900/50 rounded-b-lg"
                        : "bg-red-50 dark:bg-red-950/20 border-2 border-t-0 border-red-200 dark:border-red-900/50 rounded-b-lg"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h3
                          className={`font-semibold mb-1 text-sm ${
                            isCorrectAnswer
                              ? "text-green-700 dark:text-green-400"
                              : "text-red-700 dark:text-red-400"
                          }`}
                        >
                          {isCorrectAnswer
                            ? isSelected
                              ? "That's Correct!"
                              : "Correct Answer"
                            : "Not Quite"}
                        </h3>
                        <p className="text-sm text-foreground/70">
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handleGoBack}
          disabled={isFirstQuestion}
        >
          Previous
        </Button>
        {showFeedback ? (
          <Button onClick={handleContinue}>
            {isLastQuestion ? "Finish" : "Continue"}
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={selectedOption === null}>
            {isLastQuestion ? "Finish" : "Next"}
          </Button>
        )}
      </div>
    </div>
  );
}
