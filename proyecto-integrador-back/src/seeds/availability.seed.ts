import type { TechnicianStatus } from '../types/availability.types';

export interface AvailabilityRecord {
  userId: string;
  schedule: string;
  activeTickets: number;
  status: TechnicianStatus;
}

export const SIN_HORARIO = 'Sin horario asignado';

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