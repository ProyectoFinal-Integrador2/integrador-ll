import { query, queryOne } from '../config/db';
import type { Evaluacion, PuntuacionEvaluacion } from '../types/evaluation.types';

interface FilaEvaluacion {
  id: number;
  ticket_id: number;
  tecnico_id: number;
  tecnico_nombre: string;
  evaluador_id: number;
  evaluador_nombre: string;
  puntuacion: PuntuacionEvaluacion;
  comentario: string;
  creado_en: Date;
}

const SQL_SELECT = `
  select
    e.id,
    e.ticket_id,
    e.tecnico_id,
    te.nombre as tecnico_nombre,
    e.evaluador_id,
    ev.nombre as evaluador_nombre,
    e.puntuacion,
    e.comentario,
    e.creado_en
  from evaluaciones e
  join usuarios te on te.id = e.tecnico_id
  join usuarios ev on ev.id = e.evaluador_id
`;

const aDominio = (fila: FilaEvaluacion): Evaluacion => ({
  id: String(fila.id),
  idTicket: String(fila.ticket_id),
  idTecnico: String(fila.tecnico_id),
  tecnicoNombre: fila.tecnico_nombre,
  idEvaluador: String(fila.evaluador_id),
  evaluadorNombre: fila.evaluador_nombre,
  puntuacion: fila.puntuacion,
  comentario: fila.comentario,
  creadoEn: new Date(fila.creado_en).toISOString(),
});

export interface EvaluacionRepositorio {
  listar(): Promise<Evaluacion[]>;
  crear(
    registro: Omit<Evaluacion, 'id' | 'tecnicoNombre' | 'evaluadorNombre' | 'creadoEn'>,
  ): Promise<Evaluacion>;
  tieneResena(idTicket: string, idEvaluador: string): Promise<boolean>;
}

export class PostgresEvaluacionRepositorio implements EvaluacionRepositorio {
  async listar(): Promise<Evaluacion[]> {
    const filas = await query<FilaEvaluacion>(
      `${SQL_SELECT} order by e.creado_en desc, e.id desc`,
    );
    return filas.map(aDominio);
  }

  async crear(
    registro: Omit<Evaluacion, 'id' | 'tecnicoNombre' | 'evaluadorNombre' | 'creadoEn'>,
  ): Promise<Evaluacion> {
    const fila = await queryOne<{ id: number }>(
      `insert into evaluaciones (ticket_id, tecnico_id, evaluador_id, puntuacion, comentario)
       values ($1, $2, $3, $4, $5)
       returning id`,
      [
        Number(registro.idTicket),
        Number(registro.idTecnico),
        Number(registro.idEvaluador),
        registro.puntuacion,
        registro.comentario,
      ],
    );

    if (!fila) throw new Error('No se pudo registrar la evaluacion.');

    const completa = await queryOne<FilaEvaluacion>(
      `${SQL_SELECT} where e.id = $1`,
      [fila.id],
    );

    if (!completa) {
      throw new Error('La evaluacion quedo sin nombres resolubles y no se puede mostrar.');
    }

    return aDominio(completa);
  }

  async tieneResena(idTicket: string, idEvaluador: string): Promise<boolean> {
    const fila = await queryOne<{ existe: boolean }>(
      `select exists(
         select 1 from evaluaciones
         where ticket_id = $1 and evaluador_id = $2
       ) as existe`,
      [Number(idTicket), Number(idEvaluador)],
    );

    return fila?.existe ?? false;
  }
}

export const evaluacionRepositorio = new PostgresEvaluacionRepositorio();