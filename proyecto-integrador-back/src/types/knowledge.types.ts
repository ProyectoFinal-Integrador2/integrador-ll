/**
 * Catalogo cerrado de categorias. El frontend las usa para los filtros y para
 * los estilos de la etiqueta, asi que si el listado viviera suelto en el
 * componente, agregar una categoria implicaria acordarse de tres lugares.
 */
export const CATEGORIAS_CONOCIMIENTO = [
  'Red',
  'Hardware',
  'Software',
  'Impresoras',
  'ERP',
] as const;

export type CategoriaConocimiento = (typeof CATEGORIAS_CONOCIMIENTO)[number];

/**
 * `autorNombre` llega resuelto desde el repositorio: el articulo guarda un
 * `autorId`, no un texto, para no duplicar el dato del usuario.
 */
export interface ArticuloConocimiento {
  id: string;
  titulo: string;
  categoria: CategoriaConocimiento;
  autorNombre: string;
  vistas: number;
  /** ISO 8601. El formateo a texto legible ocurre en el frontend. */
  creadoEn: string;
}