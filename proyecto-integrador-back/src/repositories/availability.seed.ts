import type { TechnicianStatus } from '../types/availability.types';

/**
 * Lo unico que es propio de disponibilidad. El nombre, el avatar y el rol salen
 * del usuario: por eso la llave es `userId` y no un id propio.
 */
export interface AvailabilityRecord {
  userId: string;
  schedule: string;
  activeTickets: number;
  status: TechnicianStatus;
}

/** Texto para un tecnico todavia sin horario cargado. */
export const SIN_HORARIO = 'Sin horario asignado';

/**
 * Los `userId` apuntan a usuarios con rol 'Tecnico' del seed de usuarios.
 * Si un tecnico no aparece aca, el repository lo muestra igual con horario
 * vacio: dejarlo fuera lo haria desaparecer del tablero sin aviso.
 */
export const AVAILABILITY_SEED: AvailabilityRecord[] = [
  {
    userId: '2',
    schedule: 'Lunes a viernes 08:00 - 17:00',
    activeTickets: 4,
    status: 'Ocupado',
  },
  {
    userId: '3',
    schedule: 'Lunes a viernes 13:00 - 19:00',
    activeTickets: 0,
    status: 'Libre',
  },
];