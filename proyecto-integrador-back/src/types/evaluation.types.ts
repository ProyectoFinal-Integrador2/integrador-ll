/** La calificacion va de 1 a 5: medio estrella no existe en el diseno. */
export const PUNTUACIONES_EVALUACION = [1, 2, 3, 4, 5] as const;

export type PuntuacionEvaluacion = (typeof PUNTUACIONES_EVALUACION)[number];

export const MAX_LONGITUD_COMENTARIO = 500;

/**
 * `tecnicoNombre` y `evaluadorNombre` llegan ya resueltos desde el repositorio:
 * la evaluacion guarda ids de usuario, no nombres, para no duplicar el dato.
 *
 * Los dos ids viajan igual a proposito: son lo que permite responder "las
 * evaluaciones que recibio este tecnico" y "este ticket ya lo evaluo esta
 * persona" sin depender de comparar textos.
 */
export interface Evaluacion {
  id: string;
  idTicket: string;
  idTecnico: string;
  tecnicoNombre: string;
  idEvaluador: string;
  evaluadorNombre: string;
  puntuacion: PuntuacionEvaluacion;
  comentario: string;
  /** ISO 8601. El formateo a texto legible ocurre en el frontend. */
  creadoEn: string;
}

/**
 * Lo que manda el solicitante.
 *
 * No incluye `tecnicoId` ni `evaluadorId`: los dos se deducen del ticket. El
 * tecnico es el que lo atendio y quien evalua es su solicitante, asi que si el
 * cliente los mandara, un usuario podria calificar a un tecnico que nunca vio
 * su ticket o hacerse pasar por otro solicitante.
 */
export interface CrearEvaluacionInput {
  idTicket: string;
  puntuacion: number;
  comentario: string;
}