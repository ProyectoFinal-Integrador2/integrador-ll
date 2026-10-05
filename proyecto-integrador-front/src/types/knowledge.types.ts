export const KNOWLEDGE_CATEGORIES = [
  'Red',
  'Hardware',
  'Software',
  'Impresoras',
  'ERP',
] as const;

export type KnowledgeCategory = (typeof KNOWLEDGE_CATEGORIES)[number];

/** 'todos' no es una categoria: es la ausencia de filtro. */
export const ALL_CATEGORIES = 'todos' as const;

export type KnowledgeFilter = KnowledgeCategory | typeof ALL_CATEGORIES;

/** El catalogo mas "todos", que es el filtro que aparece primero. */
export const KNOWLEDGE_FILTERS: KnowledgeFilter[] = [
  ALL_CATEGORIES,
  ...KNOWLEDGE_CATEGORIES,
];

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