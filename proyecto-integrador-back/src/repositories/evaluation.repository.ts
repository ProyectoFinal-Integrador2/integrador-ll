import type { ServiceEvaluation } from '../types/evaluation.types';
import { EVALUATION_SEED, type EvaluationRecord } from './evaluations.seed';
import { userRepository, type UserRepository } from './user.repository';
import type { User } from '../types/user.types';

export interface EvaluationRepository {
  findAll(): Promise<ServiceEvaluation[]>;
  /** Los ids del registro que se acaba de crear, ya resueltos a nombres. */
  create(record: Omit<EvaluationRecord, 'id' | 'createdAt'>): Promise<ServiceEvaluation>;
  /** Ya existe una evaluacion de este ticket hecha por este solicitante. */
  hasReview(ticketId: string, reviewerId: string): Promise<boolean>;
}

/**
 * Resuelve los nombres desde los usuarios, igual que hace el repositorio de
 * disponibilidad. Guardar el nombre del tecnico dentro de la evaluacion
 * obligaria a actualizar dos lugares cada vez que un usuario cambia de nombre.
 *
 * A diferencia del resto, aqui los registros se pueden escribir: el formulario
 * de conformidad crea uno por evaluacion, asi que el seed pasa a ser el estado
 * inicial de una lista mutable.
 */
export class InMemoryEvaluationRepository implements EvaluationRepository {
  private readonly records: EvaluationRecord[] = [...EVALUATION_SEED];

  constructor(private readonly users: UserRepository = userRepository) {}

  async findAll(): Promise<ServiceEvaluation[]> {
    const users = await this.users.findAll();

    return this.records
      .map((record) => this.toService(record, users))
      .filter((evaluation): evaluation is ServiceEvaluation => evaluation !== null)
      // Mas recientes primero: en un historial lo que se consulta es lo ultimo.
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

    /**
     * No deberia pasar: el service ya valido que el ticket tiene solicitante y
     * tecnico, y esos ids salen del padron. Si ocurre, el registro quedo
     * guardado pero no se puede mostrar, asi que conviene que se note.
     */
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

  /**
   * `null` si falta alguno de los dos usuarios: una tarjeta sin nombre de
   * tecnico o de quien evaluo no dice nada. Esto hoy no se alcanza porque no hay
   * borrado de usuarios, pero si se agrega, el tablero se degrada bien en vez
   * de mostrar filas a medias.
   */
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

  /** Los ids del seed son correlativos, asi que basta con el maximo + 1. */
  private nextId(): string {
    const max = this.records.reduce((acc, record) => {
      const value = Number(record.id);
      return Number.isInteger(value) && value > acc ? value : acc;
    }, 0);

    return String(max + 1);
  }
}

export const evaluationRepository = new InMemoryEvaluationRepository();