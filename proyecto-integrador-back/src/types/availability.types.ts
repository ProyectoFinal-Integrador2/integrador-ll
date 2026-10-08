import type { ColorAvatar } from './user.types';

/**
 * "Parcial" esta en el medio a proposito: un tecnico con agenda cargada pero
 * todavia con horas libres no es ni Libre ni Ocupado, y sin ese estado habria
 * que mentir en alguno de los dos.
 */
export const ESTADOS_TECNICO = ['Libre', 'Ocupado', 'Parcial'] as const;

export type EstadoTecnico = (typeof ESTADOS_TECNICO)[number];

/** El horario por defecto cuando un tecnico no tiene uno asignado. */
export const SIN_HORARIO = 'Sin horario asignado';

/**
 * No guarda `rol` ni `area`: son datos del usuario, y duplicarlos aqui
 * significaria dos fuentes de verdad para el mismo tecnico.
 */
export interface DisponibilidadTecnico {
  /** El mismo id que tiene el usuario en la tabla de usuarios. */
  id: string;
  nombre: string;
  avatarIniciales: string;
  colorAvatar: ColorAvatar;
  horario: string;
  ticketsActivos: number;
  estado: EstadoTecnico;
}