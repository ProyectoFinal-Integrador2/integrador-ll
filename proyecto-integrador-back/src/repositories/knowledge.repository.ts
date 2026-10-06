import type { KnowledgeArticle } from '../types/knowledge.types';
import { KNOWLEDGE_SEED } from '../seeds/knowledge.seed';
import { userRepository, type UserRepository } from './user.repository';

export interface KnowledgeRepository {
  findAll(): Promise<KnowledgeArticle[]>;
}

export class InMemoryKnowledgeRepository implements KnowledgeRepository {
  constructor(private readonly users: UserRepository = userRepository) {}

  async findAll(): Promise<KnowledgeArticle[]> {
    const users = await this.users.findAll();
    const byId = new Map(users.map((user) => [user.id, user]));

    return KNOWLEDGE_SEED.flatMap((record) => {
      const author = byId.get(record.authorId);

      if (!author) return [];

      return [
        {
          id: record.id,
          title: record.title,
          category: record.category,
          authorName: author.name,
          views: record.views,
          createdAt: record.createdAt,
        },
      ];
    })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

export const knowledgeRepository = new InMemoryKnowledgeRepository();