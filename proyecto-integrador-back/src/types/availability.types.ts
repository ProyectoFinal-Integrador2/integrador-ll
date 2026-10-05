import type { AvatarColor } from './user.types';

/**
 * "Parcial" esta en el medio a proposito: un tecnico con agenda cargada pero
 * todavia con horas libres no es ni Libre ni Ocupado, y sin ese estado habria
 * que mentir en alguno de los dos.
 */
export const TECHNICIAN_STATUSES = ['Libre', 'Ocupado', 'Parcial'] as const;

export type TechnicianStatus = (typeof TECHNICIAN_STATUSES)[number];

/**
 * No guarda `role` ni `area`: son datos del usuario, y duplicarlos aqui
 * significaria dos fuentes de verdad para el mismo tecnico.
 */
export interface TechnicianAvailability {
  /** El mismo id que tiene el usuario en la collection de usuarios. */
  id: string;
  name: string;
  avatarInitials: string;
  avatarColor: AvatarColor;
  schedule: string;
  activeTickets: number;
  status: TechnicianStatus;
}