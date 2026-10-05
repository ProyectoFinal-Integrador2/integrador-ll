/**
 * Catalogo cerrado de categorias. El frontend las usa para los filtros y para
 * los estilos de la etiqueta, asi que si el listado viviera suelto en el
 * componente, agregar una categoria implicaria acordarse de tres lugares.
 */
export const KNOWLEDGE_CATEGORIES = [
  'Red',
  'Hardware',
  'Software',
  'Impresoras',
  'ERP',
] as const;

export type KnowledgeCategory = (typeof KNOWLEDGE_CATEGORIES)[number];

/**
 * `authorName` llega resuelto desde el repositorio: el articulo guarda un
 * `authorId`, no un texto, para no duplicar el dato del usuario.
 */
export interface KnowledgeArticle {
  id: string;
  title: string;
  category: KnowledgeCategory;
  authorName: string;
  views: number;
  /** ISO 8601. El formateo a texto legible ocurre en el frontend. */
  createdAt: string;
}