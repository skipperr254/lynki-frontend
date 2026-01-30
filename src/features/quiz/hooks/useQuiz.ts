import { useState } from "react";
import type { Quiz, QuizAnswer } from "@/types/quiz";
import { calculateQuizScore } from "../services/quizService";

interface UseQuizReturn {
  currentQuestionIndex: number;
  selectedOption: number | null;
  answers: Map<string, number>;
  answeredQuestions: Set<string>;
  progress: number;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  handleOptionSelect: (optionIndex: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
}

/**
 * Custom hook to manage quiz state and navigation logic.
 * @param quiz - The quiz object containing questions
 * @param onComplete - Callback when quiz is completed with score and answers
 */
export function useQuiz(
  quiz: Quiz,
  onComplete: (score: number, answers: QuizAnswer[]) => void,
): UseQuizReturn {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, number>>(new Map());
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(
    new Set(),
  );
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    const newAnsweredQuestions = new Set(answeredQuestions);
    newAnsweredQuestions.add(currentQuestion.id);
    setAnsweredQuestions(newAnsweredQuestions);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const newAnswers = new Map(answers);
    newAnswers.set(currentQuestion.id, selectedOption);
    setAnswers(newAnswers);

    if (isLastQuestion) {
      const answersArray = Array.from(newAnswers.entries()).map(
        ([questionId, selectedOption]) => ({
          questionId,
          selectedOption,
        }),
      );
      const score = calculateQuizScore(quiz, answersArray);
      onComplete(score, answersArray);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      const nextQuestion = quiz.questions[currentQuestionIndex + 1];
      setSelectedOption(newAnswers.get(nextQuestion.id) ?? null);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      // Save current answer if one is selected
      if (selectedOption !== null) {
        const newAnswers = new Map(answers);
        newAnswers.set(currentQuestion.id, selectedOption);
        setAnswers(newAnswers);
      }

      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const previousQuestion = quiz.questions[currentQuestionIndex - 1];
      setSelectedOption(answers.get(previousQuestion.id) ?? null);
    }
  };

  return {
    currentQuestionIndex,
    selectedOption,
    answers,
    answeredQuestions,
    progress,
    isFirstQuestion,
    isLastQuestion,
    handleOptionSelect,
    handleNext,
    handlePrevious,
  };
}
