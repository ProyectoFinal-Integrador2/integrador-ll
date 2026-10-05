import {
  knowledgeRepository,
  type KnowledgeRepository,
} from '../repositories/knowledge.repository';
import type { KnowledgeArticle } from '../types/knowledge.types';

export class KnowledgeService {
  constructor(private readonly repository: KnowledgeRepository = knowledgeRepository) {}

  /**
   * Solo lectura: no hay alta de articulos todavia, asi que no hay nada que
   * validar. El filtro por categoria y el buscador viven en el frontend porque
   * son de presentacion; con base de datos habria que pensarlos de otra forma.
   */
  async list(): Promise<KnowledgeArticle[]> {
    return this.repository.findAll();
  }
}

export const knowledgeService = new KnowledgeService();