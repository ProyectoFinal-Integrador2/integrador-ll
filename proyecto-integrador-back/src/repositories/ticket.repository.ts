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
  area: string | null;
  prioridad: PrioridadTicket;
  estado: EstadoTicket;
  tecnico_id: number | null;
  tecnico_nombre: string | null;
  equipo_id: number | null;
  equipo_codigo: string | null;
  equipo_nombre: string | null;
  creado_en: Date;
  iniciado_en: Date | null;
  cerrado_en: Date | null;
}

const SQL_SELECT = `
  select
    t.id,
    t.descripcion,
    t.nombre_solicitante,
    t.usuario_id,
    su.area,
    t.prioridad,
    t.estado,
    t.tecnico_id,
    t.equipo_id,
    t.creado_en,
    t.iniciado_en,
    t.cerrado_en,
    u.nombre as tecnico_nombre,
    e.codigo as equipo_codigo,
    e.nombre as equipo_nombre
  from tickets t
  left join usuarios u on u.id = t.tecnico_id
  left join usuarios su on su.id = t.usuario_id
  left join equipos e on e.id = t.equipo_id
`;

const aDominio = (fila: FilaTicket): Ticket => ({
  id: String(fila.id),
  descripcion: fila.descripcion,
  solicitante: fila.nombre_solicitante,
  usuarioId: fila.usuario_id === null ? null : String(fila.usuario_id),
  area: fila.area,
  equipoId: fila.equipo_id === null ? null : String(fila.equipo_id),
  equipoCodigo: fila.equipo_codigo,
  equipoNombre: fila.equipo_nombre,
  prioridad: fila.prioridad,
  estado: fila.estado,
  tecnicoId: fila.tecnico_id === null ? null : String(fila.tecnico_id),
  tecnicoNombre: fila.tecnico_nombre,
  creadoEn: new Date(fila.creado_en).toISOString(),
  iniciadoEn: fila.iniciado_en ? new Date(fila.iniciado_en).toISOString() : null,
  cerradoEn: fila.cerrado_en ? new Date(fila.cerrado_en).toISOString() : null,
});

export interface TicketRepositorio {
  listar(): Promise<Ticket[]>;
  obtenerPorId(id: string): Promise<Ticket | undefined>;
  crear(input: CrearTicketInput): Promise<Ticket>;
  actualizarEstado(
    id: string,
    estado: EstadoTicket,
    tecnicoId?: string,
  ): Promise<Ticket | undefined>;
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
    const fila = await queryOne<{ id: number }>(
      `insert into tickets (descripcion, nombre_solicitante, usuario_id, equipo_id, prioridad, estado)
       values ($1, $2, $3, $4, $5, 'Abierto')
       returning id`,
      [
        input.descripcion,
        input.solicitante,
        input.usuarioId === null ? null : Number(input.usuarioId),
        input.equipoId === null ? null : Number(input.equipoId),
        input.prioridad,
      ],
    );

    if (!fila) throw new Error('No se pudo crear el ticket.');

    // Se relee con el JOIN para devolver area y tecnico_nombre completos.
    const creado = await this.obtenerPorId(String(fila.id));

    if (!creado) throw new Error('No se pudo crear el ticket.');
    return creado;
  }

  async actualizarEstado(
    id: string,
    estado: EstadoTicket,
    tecnicoId?: string,
  ): Promise<Ticket | undefined> {
    const asignaciones = ['estado = $2'];

    /**
     * Las marcas se completan una sola vez: las transiciones van en un solo
     * sentido, pero `coalesce` evita que un reintento pise la hora original
     * y descuadre el reporte de SLA.
     */
    if (estado === 'En progreso') {
      asignaciones.push('iniciado_en = coalesce(iniciado_en, now())');
    }

    if (estado === 'Cerrado') {
      asignaciones.push('cerrado_en = coalesce(cerrado_en, now())');
    }

    const parametros: Array<number | string> = [Number(id), estado];

    if (tecnicoId) {
      asignaciones.push(`tecnico_id = $${parametros.length + 1}`);
      parametros.push(Number(tecnicoId));
    }

    await query(
      `update tickets set ${asignaciones.join(', ')} where id = $1`,
      parametros,
    );

    return this.obtenerPorId(id);
  }
}

export const ticketRepositorio = new PostgresTicketRepositorio();