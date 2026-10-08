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

export interface Equipo {
  id: string;
  /** Codigo de inventario, ej. `LT-014`. Es la identidad visible del equipo. */
  codigo: string;
  nombre: string;
  area: string;
  tipo: TipoEquipo;
  estado: EstadoEquipo;
  /** ISO 8601. El formateo a texto legible ocurre en el frontend. */
  creadoEn: string;
}

/** El alta la decide el dominio: un equipo nace operativo y con fecha. */
export interface CrearEquipoInput {
  codigo: string;
  nombre: string;
  area: string;
  tipo: TipoEquipo;
}

/** La edicion si permite cambiar el estado, a diferencia del alta. */
export interface ActualizarEquipoInput {
  codigo: string;
  nombre: string;
  area: string;
  tipo: TipoEquipo;
  estado: EstadoEquipo;
}