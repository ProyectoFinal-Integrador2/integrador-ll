import { query, queryOne } from '../config/db';
import type {
  CrearTicketInput,
  EstadoTicket,
  PrioridadTicket,
  Ticket,
} from '../types/ticket.types';

interface FilaTicket {
  id: number;
  descripcion: string;
  nombre_solicitante: string;
  usuario_id: number | null;
  prioridad: PrioridadTicket;
  estado: EstadoTicket;
  tecnico_id: number | null;
  creado_en: Date;
  tecnico_nombre: string | null;
}

const SQL_SELECT = `
  select
    t.id,
    t.descripcion,
    t.nombre_solicitante,
    t.usuario_id,
    t.prioridad,
    t.estado,
    t.tecnico_id,
    t.creado_en,
    u.nombre as tecnico_nombre
  from tickets t
  left join usuarios u on u.id = t.tecnico_id
`;

const aDominio = (fila: FilaTicket): Ticket => ({
  id: String(fila.id),
  descripcion: fila.descripcion,
  solicitante: fila.nombre_solicitante,
  usuarioId: fila.usuario_id === null ? null : String(fila.usuario_id),
  prioridad: fila.prioridad,
  estado: fila.estado,
  tecnicoId: fila.tecnico_id === null ? null : String(fila.tecnico_id),
  tecnicoNombre: fila.tecnico_nombre,
  creadoEn: new Date(fila.creado_en).toISOString(),
});

export interface TicketRepositorio {
  listar(): Promise<Ticket[]>;
  obtenerPorId(id: string): Promise<Ticket | undefined>;
  crear(input: CrearTicketInput): Promise<Ticket>;
  actualizarEstado(id: string, estado: EstadoTicket): Promise<Ticket | undefined>;
}

export class PostgresTicketRepositorio implements TicketRepositorio {
  async listar(): Promise<Ticket[]> {
    const filas = await query<FilaTicket>(`${SQL_SELECT} order by t.id asc`);
    return filas.map(aDominio);
  }

  async obtenerPorId(id: string): Promise<Ticket | undefined> {
    const fila = await queryOne<FilaTicket>(
      `${SQL_SELECT} where t.id = $1`,
      [Number(id)],
    );
    return fila ? aDominio(fila) : undefined;
  }

  async crear(input: CrearTicketInput): Promise<Ticket> {
    const fila = await queryOne<FilaTicket>(
      `insert into tickets (descripcion, nombre_solicitante, usuario_id, prioridad, estado)
       values ($1, $2, $3, $4, 'Abierto')
       returning id, descripcion, nombre_solicitante, usuario_id, prioridad, estado, tecnico_id, creado_en`,
      [
        input.descripcion,
        input.solicitante,
        input.usuarioId ? Number(input.usuarioId) : null,
        input.prioridad,
      ],
    );

    if (!fila) throw new Error('No se pudo crear el ticket.');
    return aDominio({ ...fila, tecnico_nombre: null });
  }

  async actualizarEstado(
    id: string,
    estado: EstadoTicket,
  ): Promise<Ticket | undefined> {
    await query('update tickets set estado = $2 where id = $1', [
      Number(id),
      estado,
    ]);

    return this.obtenerPorId(id);
  }
}

export const ticketRepositorio = new PostgresTicketRepositorio();