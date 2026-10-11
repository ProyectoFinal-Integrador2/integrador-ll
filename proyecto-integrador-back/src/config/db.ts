import { Pool, type QueryResultRow } from 'pg';
import { env } from './env';

/**
 * Pool de conexiones a Postgres.
 *
 * - Con Supabase: la URL incluye `sslmode=require`, se activa SSL.
 * - Con Docker / Postgres local: la URL no incluye `sslmode`, SSL se desactiva
 *   porque el contenedor no tiene certificados configurados.
 */
const sslConfig = env.databaseUrl.includes('sslmode=require')
  ? { rejectUnauthorized: false }
  : false;

export const pool = new Pool({
  connectionString: env.databaseUrl,
  max: 10,
  ssl: sslConfig,
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