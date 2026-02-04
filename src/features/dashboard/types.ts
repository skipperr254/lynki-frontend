/**
 * Types for the Dashboard feature
 */

export interface MaterialSummary {
  id: string;
  title: string;
  fileType: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
  totalConcepts: number;
  masteredConcepts: number;
  progressPercent: number;
  conceptsDueForReview: number;
  hasQuiz: boolean;
  errorMessage: string | null;
  isStuck: boolean; // processing for too long (> 10 minutes)
}

export interface ReviewItem {
  conceptId: string;
  conceptName: string;
  documentId: string;
  documentTitle: string;
  dueAt: string;
  reviewCount: number;
}

export interface DashboardData {
  materials: MaterialSummary[];
  reviewsDue: ReviewItem[];
  totalMaterials: number;
  totalConceptsMastered: number;
  totalConcepts: number;
  overallProgress: number;
  nextStudyItem: {
    documentId: string;
    documentTitle: string;
    conceptId: string | null;
    conceptName: string | null;
    reason: "continue" | "new" | "review";
  } | null;
}
