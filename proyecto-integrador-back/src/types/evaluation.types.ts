/** La calificacion va de 1 a 5: medio estrella no existe en el diseno. */
export const EVALUATION_RATINGS = [1, 2, 3, 4, 5] as const;

export type EvaluationRating = (typeof EVALUATION_RATINGS)[number];

export const MAX_EVALUATION_COMMENT_LENGTH = 500;

/**
 * `technicianName` y `reviewerName` llegan ya resueltos desde el repositorio:
 * la evaluacion guarda ids de usuario, no nombres, para no duplicar el dato.
 *
 * Los dos ids viajan igual a proposito: son lo que permite responder "las
 * evaluaciones que recibio este tecnico" y "este ticket ya lo evaluo esta
 * persona" sin depender de comparar textos.
 */
export interface ServiceEvaluation {
  id: string;
  ticketId: string;
  technicianId: string;
  technicianName: string;
  reviewerId: string;
  reviewerName: string;
  rating: EvaluationRating;
  comment: string;
  /** ISO 8601. El formateo a texto legible ocurre en el frontend. */
  createdAt: string;
}

/**
 * Lo que manda el solicitante.
 *
 * No incluye `technicianId` ni `reviewerId`: los dos se deducen del ticket. El
 * tecnico es el que lo atendio y quien evalua es su solicitante, asi que si el
 * cliente los mandara, un usuario podria calificar a un tecnico que nunca vio
 * su ticket o hacerse pasar por otro solicitante.
 */
export interface CreateEvaluationInput {
  ticketId: string;
  rating: number;
  comment: string;
}