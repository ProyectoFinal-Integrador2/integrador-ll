import type { ColorAvatar } from './user.types';

export const ESTADOS_TECNICO = ['Libre', 'Ocupado', 'Parcial'] as const;

export type EstadoTecnico = (typeof ESTADOS_TECNICO)[number];

export interface DisponibilidadTecnico {
  /** El mismo id que tiene el usuario. */
  id: string;
  nombre: string;
  avatarIniciales: string;
  colorAvatar: ColorAvatar;
  horario: string;
  ticketsActivos: number;
  estado: EstadoTecnico;
}

export interface EntradaDisponibilidad {
  tecnicoId: string;
  horario: string;
}