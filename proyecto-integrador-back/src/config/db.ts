import { Pool, type QueryResultRow } from 'pg';
import { env } from './env';

/**
 * Pool de conexiones a Supabase (Postgres).
 *
 * `ssl` se deja en `request` porque Supabase exige SSL y la URL ya puede
 * traer `?sslmode=require`: asi funciona con el connection string del panel
 * (suele venir con `sslmode=require`) y tambien si viene sin parametros.
 */
export const pool = new Pool({
  connectionString: env.databaseUrl,
  max: 10,
  ssl: env.databaseUrl.includes('sslmode=require') ? undefined : { rejectUnauthorized: false },
});

/** Ejecuta una consulta y devuelve solo las filas, tipadas por el llamador. */
export const query = async <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<T[]> => {
  const result = await pool.query<T>(text, params);
  return result.rows;
};

export const queryOne = async <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<T | undefined> => {
  const rows = await query<T>(text, params);
  return rows[0];
};