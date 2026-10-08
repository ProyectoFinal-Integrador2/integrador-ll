import { query } from '../config/db';
import type {
  ArticuloConocimiento,
  CategoriaConocimiento,
} from '../types/knowledge.types';

interface FilaArticulo {
  id: number;
  titulo: string;
  categoria: CategoriaConocimiento;
  autor_nombre: string;
  vistas: number;
  creado_en: Date;
}

const SQL_SELECT = `
  select
    a.id,
    a.titulo,
    a.categoria,
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
  autorNombre: fila.autor_nombre,
  vistas: fila.vistas,
  creadoEn: new Date(fila.creado_en).toISOString(),
});

export interface ConocimientoRepositorio {
  listar(): Promise<ArticuloConocimiento[]>;
}

export class PostgresConocimientoRepositorio implements ConocimientoRepositorio {
  async listar(): Promise<ArticuloConocimiento[]> {
    const filas = await query<FilaArticulo>(
      `${SQL_SELECT} order by a.creado_en desc, a.id desc`,
    );
    return filas.map(aDominio);
  }
}

export const conocimientoRepositorio = new PostgresConocimientoRepositorio();