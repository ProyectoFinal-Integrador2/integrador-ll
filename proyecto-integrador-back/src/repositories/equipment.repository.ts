import { query, queryOne } from '../config/db';
import type {
  ActualizarEquipoInput,
  CrearEquipoInput,
  Equipo,
  EstadoEquipo,
  TipoEquipo,
} from '../types/equipment.types';

interface FilaEquipo {
  id: number;
  codigo: string;
  nombre: string;
  area: string;
  tipo: TipoEquipo;
  estado: EstadoEquipo;
  creado_en: Date;
}

const aDominio = (fila: FilaEquipo): Equipo => ({
  id: String(fila.id),
  codigo: fila.codigo,
  nombre: fila.nombre,
  area: fila.area,
  tipo: fila.tipo,
  estado: fila.estado,
  creadoEn: new Date(fila.creado_en).toISOString(),
});

const COLUMNAS = 'id, codigo, nombre, area, tipo, estado, creado_en';

export interface EquipoRepositorio {
  listar(): Promise<Equipo[]>;
  obtenerPorId(id: string): Promise<Equipo | undefined>;
  crear(input: CrearEquipoInput): Promise<Equipo>;
  actualizar(id: string, input: ActualizarEquipoInput): Promise<Equipo | undefined>;
}

export class PostgresEquipoRepositorio implements EquipoRepositorio {
  async listar(): Promise<Equipo[]> {
    const filas = await query<FilaEquipo>(`select ${COLUMNAS} from equipos order by id asc`);
    return filas.map(aDominio);
  }

  async obtenerPorId(id: string): Promise<Equipo | undefined> {
    const fila = await queryOne<FilaEquipo>(
      `select ${COLUMNAS} from equipos where id = $1`,
      [Number(id)],
    );
    return fila ? aDominio(fila) : undefined;
  }

  async crear(input: CrearEquipoInput): Promise<Equipo> {
    const fila = await queryOne<FilaEquipo>(
      `insert into equipos (codigo, nombre, area, tipo, estado)
       values ($1, $2, $3, $4, 'Operativo')
       returning ${COLUMNAS}`,
      [input.codigo, input.nombre, input.area, input.tipo],
    );

    if (!fila) throw new Error('No se pudo crear el equipo.');
    return aDominio(fila);
  }

  async actualizar(
    id: string,
    input: ActualizarEquipoInput,
  ): Promise<Equipo | undefined> {
    const fila = await queryOne<FilaEquipo>(
      `update equipos
       set codigo = $2, nombre = $3, area = $4, tipo = $5, estado = $6
       where id = $1
       returning ${COLUMNAS}`,
      [Number(id), input.codigo, input.nombre, input.area, input.tipo, input.estado],
    );

    return fila ? aDominio(fila) : undefined;
  }
}

export const equipoRepositorio = new PostgresEquipoRepositorio();