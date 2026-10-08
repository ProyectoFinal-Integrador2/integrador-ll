import {
  evaluacionRepositorio,
  type EvaluacionRepositorio,
} from '../repositories/evaluation.repository';
import {
  ticketRepositorio,
  type TicketRepositorio,
} from '../repositories/ticket.repository';
import { HttpError } from '../utils/httpError';
import {
  PUNTUACIONES_EVALUACION,
  MAX_LONGITUD_COMENTARIO,
  type CrearEvaluacionInput,
  type Evaluacion,
  type PuntuacionEvaluacion,
} from '../types/evaluation.types';
import type { Ticket } from '../types/ticket.types';

/** El body viene de `req.body`, o sea `any`: aqui se acota al dominio. */
type EntradaEvaluacionSinValidar = Partial<CrearEvaluacionInput>;

export class EvaluacionServicio {
  constructor(
    private readonly repositorio: EvaluacionRepositorio = evaluacionRepositorio,
    private readonly tickets: TicketRepositorio = ticketRepositorio,
  ) {}

  async listar(): Promise<Evaluacion[]> {
    return this.repositorio.listar();
  }

  /**
   * Registra la conformidad de un ticket cerrado.
   *
   * El tecnico y el evaluador no se reciben: se deducen del ticket. El tecnico
   * es el que lo atendio y el evaluador es su solicitante, asi que el cliente
   * no puede calificar a un tecnico que nunca vio su ticket ni hacerse pasar
   * por otra persona.
   */
  async crear(input: EntradaEvaluacionSinValidar): Promise<Evaluacion> {
    const idTicket = input.idTicket?.trim() ?? '';

    if (idTicket.length === 0) {
      throw HttpError.badRequest('El ticket es obligatorio.');
    }

    const ticket = await this.tickets.obtenerPorId(idTicket);

    if (!ticket) {
      throw HttpError.notFound('Ticket no encontrado.');
    }

    if (ticket.estado !== 'Cerrado') {
      throw HttpError.badRequest(
        'Solo se puede evaluar un ticket cerrado: el soporte todavia no termino.',
      );
    }

    if (!ticket.usuarioId) {
      throw HttpError.badRequest(
        'Este ticket no tiene solicitante registrado: no se sabe a nombre de quien evaluar.',
      );
    }

    if (!ticket.tecnicoId) {
      throw HttpError.badRequest(
        'Este ticket no tiene un tecnico asignado: no se puede evaluar la atencion.',
      );
    }

    const puntuacion = Number(input.puntuacion);

    if (!PUNTUACIONES_EVALUACION.includes(puntuacion as PuntuacionEvaluacion)) {
      throw HttpError.badRequest('La calificacion debe ser un numero del 1 al 5.');
    }

    const comentario = input.comentario?.trim() ?? '';

    if (comentario.length > MAX_LONGITUD_COMENTARIO) {
      throw HttpError.badRequest(
        `El comentario no puede superar los ${MAX_LONGITUD_COMENTARIO} caracteres.`,
      );
    }

    if (await this.repositorio.tieneResena(idTicket, ticket.usuarioId)) {
      throw HttpError.badRequest('Ya evaluaste este ticket.');
    }

    return this.repositorio.crear({
      idTicket: ticket.id,
      idTecnico: ticket.tecnicoId,
      idEvaluador: ticket.usuarioId,
      puntuacion: puntuacion as PuntuacionEvaluacion,
      comentario,
    });
  }

  /**
   * Tickets cerrados del solicitante que todavia no califico: lo que el
   * formulario de conformidad tiene para ofrecer.
   */
  async listarPendientes(usuarioId: string): Promise<Ticket[]> {
    const [todosLosTickets, todasLasEvaluaciones] = await Promise.all([
      this.tickets.listar(),
      this.repositorio.listar(),
    ]);

    const evaluados = new Set(
      todasLasEvaluaciones
        .filter((evaluacion) => evaluacion.idEvaluador === usuarioId)
        .map((evaluacion) => evaluacion.idTicket),
    );

    return todosLosTickets
      .filter(
        (ticket) =>
          ticket.usuarioId === usuarioId &&
          ticket.estado === 'Cerrado' &&
          !evaluados.has(ticket.id),
      )
      // Mas recientes primero: el pendiente que se ve primero es el ultimo caso.
      .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
  }
}

export const evaluacionServicio = new EvaluacionServicio();