export const TIPOS_EQUIPO = [
  'Laptop',
  'Desktop',
  'Impresora',
  'Monitor',
] as const;

export const ESTADOS_EQUIPO = [
  'Operativo',
  'En reparación',
  'Dado de baja',
] as const;

export type TipoEquipo = (typeof TIPOS_EQUIPO)[number];
export type EstadoEquipo = (typeof ESTADOS_EQUIPO)[number];

export const FILTROS_EQUIPO = [
  'todos',
  'Laptop',
  'Desktop',
  'Impresora',
  'En reparación',
] as const;

export type FiltroEquipo = (typeof FILTROS_EQUIPO)[number];

export interface Equipo {
  id: string;
  codigo: string;
  nombre: string;
  area: string;
  tipo: TipoEquipo;
  estado: EstadoEquipo;
  creadoEn: string;
}

export interface CrearEquipoInput {
  codigo: string;
  nombre: string;
  area: string;
  tipo: TipoEquipo;
}

export interface ActualizarEquipoInput {
  codigo: string;
  nombre: string;
  area: string;
  tipo: TipoEquipo;
  estado: EstadoEquipo;
}