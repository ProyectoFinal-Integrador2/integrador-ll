export const EVALUATION_RATINGS = [1, 2, 3, 4, 5] as const;

export type EvaluationRating = (typeof EVALUATION_RATINGS)[number];
export interface ServiceEvaluation {
  id: string;
  ticketId: string;
  technicianId: string;
  technicianName: string;
  reviewerId: string;
  reviewerName: string;
  rating: EvaluationRating;
  comment: string;
  createdAt: string;
}

export interface CreateEvaluationInput {
  ticketId: string;
  rating: EvaluationRating;
  comment: string;
}