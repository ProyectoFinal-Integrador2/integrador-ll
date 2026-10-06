export const KNOWLEDGE_CATEGORIES = [
  'Red',
  'Hardware',
  'Software',
  'Impresoras',
  'ERP',
] as const;

export type KnowledgeCategory = (typeof KNOWLEDGE_CATEGORIES)[number];

export const ALL_CATEGORIES = 'todos' as const;

export type KnowledgeFilter = KnowledgeCategory | typeof ALL_CATEGORIES;

export const KNOWLEDGE_FILTERS: KnowledgeFilter[] = [
  ALL_CATEGORIES,
  ...KNOWLEDGE_CATEGORIES,
];

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: KnowledgeCategory;
  authorName: string;
  views: number;
  createdAt: string;
}