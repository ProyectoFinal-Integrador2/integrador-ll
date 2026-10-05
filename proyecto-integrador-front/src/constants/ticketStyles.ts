import type { TicketPriority, TicketStatus } from '../types/ticket.types';

/**
 * Paleta por prioridad y por estado.
 *
 * En el componente original esto eran dos funciones `switch` definidas dentro
 * del render: se recreaban en cada pasada y cualquier cambio de color habia
 * que buscarlo a mano. Ahora el color se declara una vez, junto al tipo que
 * lo keyea, y el typo avisa si falta una prioridad.
 */
export const TICKET_PRIORITY_STYLES: Record<TicketPriority, string> = {
  'Crítico': 'bg-red-100 text-red-700',
  'Alto': 'bg-orange-100 text-orange-700',
  'Medio': 'bg-blue-100 text-blue-700',
  'Bajo': 'bg-green-100 text-green-700',
};

export const TICKET_STATUS_STYLES: Record<TicketStatus, string> = {
  'Abierto': 'bg-emerald-100 text-emerald-700',
  'En progreso': 'bg-blue-100 text-blue-700',
  'Cerrado': 'bg-slate-200 text-slate-600',
};
