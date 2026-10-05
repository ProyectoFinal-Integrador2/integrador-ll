import { apiGet } from './apiClient';
import type { KnowledgeArticle } from '../types/knowledge.types';

export const fetchKnowledgeArticles = (
  signal?: AbortSignal,
): Promise<KnowledgeArticle[]> =>
  apiGet<KnowledgeArticle[]>('/knowledge-base', signal);