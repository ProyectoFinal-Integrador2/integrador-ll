import type { AvatarColor } from './user.types';

export const TECHNICIAN_STATUSES = ['Libre', 'Ocupado', 'Parcial'] as const;

export type TechnicianStatus = (typeof TECHNICIAN_STATUSES)[number];

/**
 * No trae `role` ni `area`: son datos del usuario y llegan desde el mismo
 * endpoint de usuarios.
 */
export interface TechnicianAvailability {
  /** El mismo id que tiene el usuario. */
  id: string;
  name: string;
  avatarInitials: string;
  avatarColor: AvatarColor;
  schedule: string;
  activeTickets: number;
  status: TechnicianStatus;
}