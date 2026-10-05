export const EVALUATION_RATINGS = [1, 2, 3, 4, 5] as const;

export type EvaluationRating = (typeof EVALUATION_RATINGS)[number];

/** Los nombres del tecnico y de quien evalua llegan resueltos desde el back. */
export interface ServiceEvaluation {
  id: string;
  ticketId: string;
  /** Necesario para mostrar "las evaluaciones que recibi". */
  technicianId: string;
  technicianName: string;
  /** Permite saber si este ticket ya tiene conformidad de quien lo pidio. */
  reviewerId: string;
  reviewerName: string;
  rating: EvaluationRating;
  comment: string;
  /** ISO 8601. */
  createdAt: string;
}

/**
 * El back deduce el tecnico y el evaluador del ticket, asi que aqui solo viaja
 * lo que escribe la persona: que ticket, cuantas estrellas y el comentario.
 */
export interface CreateEvaluationInput {
  ticketId: string;
  rating: EvaluationRating;
  comment: string;
}