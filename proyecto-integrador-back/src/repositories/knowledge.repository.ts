import { query, queryOne } from '../config/db';
import type {
  ArticuloConocimiento,
  CategoriaConocimiento,
  CrearArticuloInput,
} from '../types/knowledge.types';

interface FilaArticulo {
  id: number;
  titulo: string;
  categoria: CategoriaConocimiento;
  autor_nombre: string;
  contenido: string | null;
  vistas: number;
  creado_en: Date;
}

const SQL_SELECT = `
  select
    a.id,
    a.titulo,
    a.categoria,
    a.contenido,
    u.nombre as autor_nombre,
    a.vistas,
    a.creado_en
  from articulos_conocimiento a
  join usuarios u on u.id = a.autor_id
`;

const aDominio = (fila: FilaArticulo): ArticuloConocimiento => ({
  id: String(fila.id),
  titulo: fila.titulo,
  categoria: fila.categoria,
  contenido: fila.contenido,
  autorNombre: fila.autor_nombre,
  vistas: fila.vistas,
  creadoEn: new Date(fila.creado_en).toISOString(),
});

export interface ConocimientoRepositorio {
  listar(): Promise<ArticuloConocimiento[]>;
  crear(input: CrearArticuloInput, autorId: string): Promise<ArticuloConocimiento>;
}

export class PostgresConocimientoRepositorio implements ConocimientoRepositorio {
  async listar(): Promise<ArticuloConocimiento[]> {
    const filas = await query<FilaArticulo>(
      `${SQL_SELECT} order by a.creado_en desc, a.id desc`,
    );
    return filas.map(aDominio);
  }

  async crear(input: CrearArticuloInput, autorId: string): Promise<ArticuloConocimiento> {
    const insertada = await queryOne<{ id: number }>(
      `insert into articulos_conocimiento (titulo, categoria, autor_id, contenido)
       values ($1, $2, $3, $4)
       returning id`,
      [input.titulo, input.categoria, Number(autorId), input.contenido ?? null],
    );

    if (!insertada) throw new Error('No se pudo crear el articulo.');

    const fila = await queryOne<FilaArticulo>(
      `${SQL_SELECT} where a.id = $1`,
      [insertada.id],
    );

    if (!fila) throw new Error('No se pudo crear el articulo.');
    return aDominio(fila);
  }
}

export const conocimientoRepositorio = new PostgresConocimientoRepositorio();