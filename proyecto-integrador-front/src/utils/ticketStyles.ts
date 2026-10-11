import type { PrioridadTicket, EstadoTicket } from '../types/ticket.types';

export const ESTILOS_PRIORIDAD: Record<PrioridadTicket, string> = {
  'Crítico': 'bg-red-100 text-red-700',
  'Alto': 'bg-orange-100 text-orange-700',
  'Medio': 'bg-blue-100 text-blue-700',
  'Bajo': 'bg-green-100 text-green-700',
};

export const ESTILOS_ESTADO: Record<EstadoTicket, string> = {
  'Abierto': 'bg-emerald-100 text-emerald-700',
  'En progreso': 'bg-blue-100 text-blue-700',
  'Cerrado': 'bg-slate-200 text-slate-600',
  'Cancelado': 'bg-rose-100 text-rose-700',
};