import type { SlaPriority } from '../types/sla.types';

/**
 * Datos de arranque. Cifras en minutos: se formatean al pintarlas.
 *
 * Los tiempos salen de la politica de Quimesa: un critico se atiende en el
 * acto y se resuelve en 4 horas; uno bajo puede esperar un dia.
 */
export const SLA_SEED: SlaPriority[] = [
  {
    id: '1',
    level: 'Crítico',
    description:
      'Caída total del servicio o cierre de area critica para el negocio',
    responseMinutes: 15,
    resolutionMinutes: 240,
    escalationMinutes: 0,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: '2',
    level: 'Alto',
    description:
      'Un servicio critico queda degradado o un grupo de usuarios se ve afectado',
    responseMinutes: 60,
    resolutionMinutes: 480,
    escalationMinutes: 30,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: '3',
    level: 'Medio',
    description:
      'Falla que impide trabajar a un usuario sin frenar la operacion del area',
    responseMinutes: 240,
    resolutionMinutes: 1440,
    escalationMinutes: 120,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: '4',
    level: 'Bajo',
    description:
      'Solicitud de soporte, consulta o falla que tiene alternativa de trabajo',
    responseMinutes: 480,
    resolutionMinutes: 4320,
    escalationMinutes: 480,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
];