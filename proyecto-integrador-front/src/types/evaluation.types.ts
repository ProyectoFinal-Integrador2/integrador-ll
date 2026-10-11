export const PUNTUACIONES_EVALUACION = [1, 2, 3, 4, 5] as const;

export type PuntuacionEvaluacion = (typeof PUNTUACIONES_EVALUACION)[number];

export interface Evaluacion {
  id: string;
  idTicket: string;
  idTecnico: string;
  tecnicoNombre: string;
  idEvaluador: string;
  evaluadorNombre: string;
  puntuacion: PuntuacionEvaluacion;
  comentario: string;
  creadoEn: string;
}

export interface CrearEvaluacionInput {
  idTicket: string;
  puntuacion: PuntuacionEvaluacion;
  comentario: string;
}