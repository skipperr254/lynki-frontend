export interface GradeInfo {
  emoji: string;
  message: string;
  color: string;
}

/**
 * Determines the grade message based on the percentage score.
 * @param percentage - The percentage score (0-100)
 * @returns Grade information including emoji, message, and color
 */
export function getGradeMessage(percentage: number): GradeInfo {
  if (percentage >= 90) {
    return { emoji: "🎉", message: "Outstanding!", color: "text-green-600" };
  }
  if (percentage >= 70) {
    return { emoji: "🌟", message: "Great job!", color: "text-blue-600" };
  }
  if (percentage >= 50) {
    return { emoji: "👍", message: "Good effort!", color: "text-yellow-600" };
  }
  return {
    emoji: "💪",
    message: "Keep practicing!",
    color: "text-orange-600",
  };
}
