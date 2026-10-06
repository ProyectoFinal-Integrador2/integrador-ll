import type { ServiceEvaluation } from '../types/evaluation.types';
import { EVALUATION_SEED, type EvaluationRecord } from '../seeds/evaluations.seed';
import { userRepository, type UserRepository } from './user.repository';
import type { User } from '../types/user.types';

export interface EvaluationRepository {
  findAll(): Promise<ServiceEvaluation[]>;
  create(record: Omit<EvaluationRecord, 'id' | 'createdAt'>): Promise<ServiceEvaluation>;
  hasReview(ticketId: string, reviewerId: string): Promise<boolean>;
}


export class InMemoryEvaluationRepository implements EvaluationRepository {
  private readonly records: EvaluationRecord[] = [...EVALUATION_SEED];

  constructor(private readonly users: UserRepository = userRepository) {}

  async findAll(): Promise<ServiceEvaluation[]> {
    const users = await this.users.findAll();

    return this.records
      .map((record) => this.toService(record, users))
      .filter((evaluation): evaluation is ServiceEvaluation => evaluation !== null)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async create(
    record: Omit<EvaluationRecord, 'id' | 'createdAt'>,
  ): Promise<ServiceEvaluation> {
    const next: EvaluationRecord = {
      ...record,
      id: this.nextId(),
      createdAt: new Date().toISOString(),
    };

    this.records.push(next);

    const evaluation = this.toService(next, await this.users.findAll());

    if (!evaluation) {
      throw new Error(
        `La evaluacion ${next.id} quedo sin nombres resolubles y no se puede mostrar.`,
      );
    }

    return evaluation;
  }

  async hasReview(ticketId: string, reviewerId: string): Promise<boolean> {
    return this.records.some(
      (record) => record.ticketId === ticketId && record.reviewerId === reviewerId,
    );
  }

  private toService(record: EvaluationRecord, users: User[]): ServiceEvaluation | null {
    const technician = users.find((user) => user.id === record.technicianId);
    const reviewer = users.find((user) => user.id === record.reviewerId);

    if (!technician || !reviewer) return null;

    return {
      id: record.id,
      ticketId: record.ticketId,
      technicianId: technician.id,
      technicianName: technician.name,
      reviewerId: reviewer.id,
      reviewerName: reviewer.name,
      rating: record.rating,
      comment: record.comment,
      createdAt: record.createdAt,
    };
  }

  private nextId(): string {
    const max = this.records.reduce((acc, record) => {
      const value = Number(record.id);
      return Number.isInteger(value) && value > acc ? value : acc;
    }, 0);

    return String(max + 1);
  }
}

export const evaluationRepository = new InMemoryEvaluationRepository();