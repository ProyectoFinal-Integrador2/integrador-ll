import {
  evaluationRepository,
  type EvaluationRepository,
} from '../repositories/evaluation.repository';
import {
  ticketRepository,
  type TicketRepository,
} from '../repositories/ticket.repository';
import { HttpError } from '../utils/httpError';
import {
  EVALUATION_RATINGS,
  MAX_EVALUATION_COMMENT_LENGTH,
  type CreateEvaluationInput,
  type EvaluationRating,
  type ServiceEvaluation,
} from '../types/evaluation.types';
import type { Ticket } from '../types/ticket.types';

/** El body viene de `req.body`, o sea `any`: aqui se acota al dominio. */
type UntrustedEvaluationInput = Partial<CreateEvaluationInput>;

export class EvaluationService {
  constructor(
    private readonly repository: EvaluationRepository = evaluationRepository,
    private readonly tickets: TicketRepository = ticketRepository,
  ) {}

  async list(): Promise<ServiceEvaluation[]> {
    return this.repository.findAll();
  }

  /**
   * Registra la conformidad de un ticket cerrado.
   *
   * El tecnico y el evaluador no se reciben: se deducen del ticket. El tecnico
   * es el que lo atendio y el evaluador es su solicitante, asi que el cliente
   * no puede calificar a un tecnico que nunca vio su ticket ni hacerse pasar
   * por otra persona.
   *
   * Ojo: sigue sin haber autenticacion, asi que el `ticketId` se cree de lo que
   * dice el body. Cuando exista auth, hay que comprobar que quien llama sea el
   * `userId` del ticket antes de dejar que califique.
   */
  async create(input: UntrustedEvaluationInput): Promise<ServiceEvaluation> {
    const ticketId = input.ticketId?.trim() ?? '';

    if (ticketId.length === 0) {
      throw HttpError.badRequest('El ticket es obligatorio.');
    }

    const ticket = await this.tickets.findById(ticketId);

    if (!ticket) {
      throw HttpError.notFound('Ticket no encontrado.');
    }

    if (ticket.status !== 'Cerrado') {
      throw HttpError.badRequest(
        'Solo se puede evaluar un ticket cerrado: el soporte todavia no termino.',
      );
    }

    if (!ticket.userId) {
      throw HttpError.badRequest(
        'Este ticket no tiene solicitante registrado: no se sabe a nombre de quien evaluar.',
      );
    }

    if (!ticket.technicianId) {
      throw HttpError.badRequest(
        'Este ticket no tiene un tecnico asignado: no se puede evaluar la atencion.',
      );
    }

    const rating = Number(input.rating);

    if (!EVALUATION_RATINGS.includes(rating as EvaluationRating)) {
      throw HttpError.badRequest('La calificacion debe ser un numero del 1 al 5.');
    }

    const comment = input.comment?.trim() ?? '';

    if (comment.length > MAX_EVALUATION_COMMENT_LENGTH) {
      throw HttpError.badRequest(
        `El comentario no puede superar los ${MAX_EVALUATION_COMMENT_LENGTH} caracteres.`,
      );
    }

    if (await this.repository.hasReview(ticketId, ticket.userId)) {
      throw HttpError.badRequest('Ya evaluaste este ticket.');
    }

    return this.repository.create({
      ticketId: ticket.id,
      technicianId: ticket.technicianId,
      reviewerId: ticket.userId,
      rating: rating as EvaluationRating,
      comment,
    });
  }

  /**
   * Tickets cerrados del solicitante que todavia no califico: lo que el
   * formulario de conformidad tiene para ofrecer.
   */
  async listPending(userId: string): Promise<Ticket[]> {
    const [allTickets, allEvaluations] = await Promise.all([
      this.tickets.findAll(),
      this.repository.findAll(),
    ]);

    const reviewed = new Set(
      allEvaluations
        .filter((evaluation) => evaluation.reviewerId === userId)
        .map((evaluation) => evaluation.ticketId),
    );

    return allTickets
      .filter(
        (ticket) =>
          ticket.userId === userId &&
          ticket.status === 'Cerrado' &&
          !reviewed.has(ticket.id),
      )
      // Mas recientes primero: el pendiente que se ve primero es el ultimo caso.
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

export const evaluationService = new EvaluationService();