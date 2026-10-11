export const CATEGORIAS_CONOCIMIENTO = [
  'Red',
  'Hardware',
  'Software',
  'Impresoras',
  'ERP',
] as const;

export type CategoriaConocimiento = (typeof CATEGORIAS_CONOCIMIENTO)[number];

export const TODAS_CATEGORIAS = 'todos' as const;

export type FiltroConocimiento = CategoriaConocimiento | typeof TODAS_CATEGORIAS;

export const FILTROS_CONOCIMIENTO: FiltroConocimiento[] = [
  TODAS_CATEGORIAS,
  ...CATEGORIAS_CONOCIMIENTO,
];

export interface ArticuloConocimiento {
  id: string;
  titulo: string;
  categoria: CategoriaConocimiento;
  contenido: string | null;
  autorNombre: string;
  vistas: number;
  creadoEn: string;
}

export interface EntradaArticuloConocimiento {
  titulo: string;
  categoria: CategoriaConocimiento;
  contenido?: string | null;
}