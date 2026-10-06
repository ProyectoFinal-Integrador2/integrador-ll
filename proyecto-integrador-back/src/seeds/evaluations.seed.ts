import type { EvaluationRating } from '../types/evaluation.types';

export interface EvaluationRecord {
  id: string;
  ticketId: string;
  technicianId: string;
  reviewerId: string;
  rating: EvaluationRating;
  comment: string;
  createdAt: string;
}

export const EVALUATION_SEED: EvaluationRecord[] = [
  {
    id: '1',
    ticketId: '5',
    technicianId: '3',
    reviewerId: '6',
    rating: 5,
    comment:
      'Resolvio el alta de correo en el mismo dia y explico como pedirlo la proxima vez.',
    createdAt: '2026-09-21T10:20:00.000Z',
  },
  {
    id: '2',
    ticketId: '4',
    technicianId: '2',
    reviewerId: '7',
    rating: 4,
    comment:
      'La impresora quedo funcionando, pero tardo dos visitas en llevar las piezas.',
    createdAt: '2026-09-26T09:05:00.000Z',
  },
  {
    id: '3',
    ticketId: '10',
    technicianId: '2',
    reviewerId: '5',
    rating: 3,
    comment:
      'El correo se creo bien, aunque nadie me aviso que ya estaba listo y lo vine a buscar.',
    createdAt: '2026-09-27T11:40:00.000Z',
  },
  {
    id: '4',
    ticketId: '9',
    technicianId: '3',
    reviewerId: '6',
    rating: 5,
    comment: 'Diagnostico rapido y dejo el teclado con el driver actualizado.',
    createdAt: '2026-09-28T16:15:00.000Z',
  },
];