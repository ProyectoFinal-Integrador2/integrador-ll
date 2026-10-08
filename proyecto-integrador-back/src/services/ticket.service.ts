import {
  ticketRepositorio,
  type TicketRepositorio,
} from '../repositories/ticket.repository';
import { HttpError } from '../utils/httpError';
import {
  PRIORIDADES_TICKET,
  ESTADOS_TICKET,
  TRANSICIONES_ESTADO,
  type ActualizarEstadoTicketInput,
  type CrearTicketInput,
  type EstadoTicket,
  type PrioridadTicket,
  type Ticket,
} from '../types/ticket.types';

const MIN_LONGITUD_DESCRIPCION = 10;

/** El body viene de `req.body`, o sea `any`: aqui se acota al dominio. */
type EntradaTicketSinValidar = Partial<CrearTicketInput>;

type EntradaEstadoSinValidar = Partial<ActualizarEstadoTicketInput>;

export class TicketServicio {
  constructor(private readonly repositorio: TicketRepositorio) {}

  async listar(): Promise<Ticket[]> {
    const tickets = await this.repositorio.listar();
    return [...tickets].sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
  }

  async crear(input: EntradaTicketSinValidar): Promise<Ticket> {
    const descripcion = input.descripcion?.trim() ?? '';

    if (descripcion.length < MIN_LONGITUD_DESCRIPCION) {
      throw HttpError.badRequest(
        `La descripcion debe tener al menos ${MIN_LONGITUD_DESCRIPCION} caracteres.`,
      );
    }

    const solicitante = input.solicitante?.trim() ?? '';

    if (solicitante.length === 0) {
      throw HttpError.badRequest('El solicitante es obligatorio.');
    }

    const prioridad = input.prioridad;

    if (!prioridad || !PRIORIDADES_TICKET.includes(prioridad)) {
      throw HttpError.badRequest('La prioridad no es valida.');
    }

    /**
     * El id del solicitante es opcional: el Jefe TI puede abrir un ticket a
     * nombre de alguien escribiendo su nombre, y en ese caso no hay id que
     * guardar. Quien se registra desde la sesion si lo manda. La integridad la
     * garantiza la llave foranea de la base de datos.
     */
    const usuarioId = input.usuarioId?.trim();

    return this.repositorio.crear({
      descripcion,
      solicitante,
      usuarioId: usuarioId && usuarioId.length > 0 ? usuarioId : undefined,
      prioridad: prioridad as PrioridadTicket,
    });
  }

  /**
   * Mueve el ticket a `estado`. El service es quien valida la transicion para
   * que ningun endpoint pueda saltarse el ciclo del soporte.
   *
   * Ojo: todavia no se valida el rol de quien llama. Sin autenticacion,
   * cualquiera que conozca la API podria culminar un ticket.
   */
  async cambiarEstado(id: string, input: EntradaEstadoSinValidar): Promise<Ticket> {
    const ticket = await this.repositorio.obtenerPorId(id);

    if (!ticket) {
      throw HttpError.notFound('Ticket no encontrado.');
    }

    const estado = input.estado;

    if (!estado || !ESTADOS_TICKET.includes(estado)) {
      throw HttpError.badRequest('El estado no es valido.');
    }

    const permitidos = TRANSICIONES_ESTADO[ticket.estado];

    if (!permitidos.includes(estado as EstadoTicket)) {
      throw HttpError.badRequest(
        permitidos.length === 0
          ? `El ticket ya esta ${ticket.estado.toLowerCase()}: no admite mas cambios de estado.`
          : `Un ticket en estado "${ticket.estado}" solo puede pasar a ${permitidos
              .map((siguiente) => `"${siguiente}"`)
              .join(' o ')}.`,
      );
    }

    const actualizado = await this.repositorio.actualizarEstado(id, estado as EstadoTicket);

    if (!actualizado) {
      // Solo posible si el ticket desaparece entre obtenerPorId y actualizarEstado.
      throw HttpError.notFound('Ticket no encontrado.');
    }

    return actualizado;
  }
}

export const ticketServicio = new TicketServicio(ticketRepositorio);