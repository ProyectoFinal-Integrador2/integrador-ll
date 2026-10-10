import { query, queryOne } from '../config/db';
import type {
  ActualizarSlaPrioridadInput,
  CrearSlaPrioridadInput,
  NivelSla,
  SlaPrioridad,
} from '../types/sla.types';

interface FilaSla {
  id: number;
  nivel: NivelSla;
  descripcion: string;
  minutos_respuesta: number;
  minutos_resolucion: number;
  minutos_escalamiento: number;
  actualizado_en: Date;
}

const aDominio = (fila: FilaSla): SlaPrioridad => ({
  id: String(fila.id),
  nivel: fila.nivel,
  descripcion: fila.descripcion,
  minutosRespuesta: fila.minutos_respuesta,
  minutosResolucion: fila.minutos_resolucion,
  minutosEscalamiento: fila.minutos_escalamiento,
  actualizadoEn: new Date(fila.actualizado_en).toISOString(),
});

const COLUMNAS =
  'id, nivel, descripcion, minutos_respuesta, minutos_resolucion, minutos_escalamiento, actualizado_en';

export interface SlaRepositorio {
  listar(): Promise<SlaPrioridad[]>;
  obtenerPorId(id: string): Promise<SlaPrioridad | undefined>;
  crear(input: CrearSlaPrioridadInput): Promise<SlaPrioridad>;
  actualizar(
    id: string,
    input: ActualizarSlaPrioridadInput,
  ): Promise<SlaPrioridad | undefined>;
}

export class PostgresSlaRepositorio implements SlaRepositorio {
  async listar(): Promise<SlaPrioridad[]> {
    const filas = await query<FilaSla>(`select ${COLUMNAS} from sla_prioridades order by id asc`);
    return filas.map(aDominio);
  }

  async obtenerPorId(id: string): Promise<SlaPrioridad | undefined> {
    const fila = await queryOne<FilaSla>(
      `select ${COLUMNAS} from sla_prioridades where id = $1`,
      [Number(id)],
    );
    return fila ? aDominio(fila) : undefined;
  }

  async crear(input: CrearSlaPrioridadInput): Promise<SlaPrioridad> {
    const fila = await queryOne<FilaSla>(
      `insert into sla_prioridades
         (nivel, descripcion, minutos_respuesta, minutos_resolucion, minutos_escalamiento)
       values ($1, $2, $3, $4, $5)
       returning ${COLUMNAS}`,
      [
        input.nivel,
        input.descripcion,
        input.minutosRespuesta,
        input.minutosResolucion,
        input.minutosEscalamiento,
      ],
    );

    if (!fila) throw new Error('No se pudo crear la prioridad SLA.');
    return aDominio(fila);
  }

  async actualizar(
    id: string,
    input: ActualizarSlaPrioridadInput,
  ): Promise<SlaPrioridad | undefined> {
    const fila = await queryOne<FilaSla>(
      `update sla_prioridades
       set nivel = $2, descripcion = $3, minutos_respuesta = $4,
           minutos_resolucion = $5, minutos_escalamiento = $6, actualizado_en = now()
       where id = $1
       returning ${COLUMNAS}`,
      [
        Number(id),
        input.nivel,
        input.descripcion,
        input.minutosRespuesta,
        input.minutosResolucion,
        input.minutosEscalamiento,
      ],
    );

    return fila ? aDominio(fila) : undefined;
  }
}

export const slaRepositorio = new PostgresSlaRepositorio();