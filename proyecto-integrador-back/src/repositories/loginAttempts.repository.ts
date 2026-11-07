import { pool } from '../config/db';

export interface EstadoIntentos {
  intentos: number;
  bloqueadoHasta: string | null;
}

export interface IntentosRepositorio {
  conBloqueo<T>(correo: string, accion: (estado: EstadoIntentos, guardar: (estado: EstadoIntentos) => Promise<void>) => Promise<T>): Promise<T>;
}

export class PostgresIntentosRepositorio implements IntentosRepositorio {
  async conBloqueo<T>(correo: string, accion: (estado: EstadoIntentos, guardar: (estado: EstadoIntentos) => Promise<void>) => Promise<T>): Promise<T> {
    const cliente = await pool.connect();
    try {
      await cliente.query('BEGIN');
      // Serializa incluso el primer intento y funciona entre procesos del backend.
      await cliente.query('SELECT pg_advisory_xact_lock(hashtextextended($1, 0))', [correo]);
      const { rows } = await cliente.query<{ intentos: number; bloqueado_hasta: Date | null }>(
        'SELECT intentos, bloqueado_hasta FROM intentos_login WHERE correo = $1', [correo],
      );
      const estado: EstadoIntentos = {
        intentos: rows[0]?.intentos ?? 0,
        bloqueadoHasta: rows[0]?.bloqueado_hasta?.toISOString() ?? null,
      };
      const resultado = await accion(estado, async (nuevo) => {
        if (nuevo.intentos === 0 && nuevo.bloqueadoHasta === null) {
          await cliente.query('DELETE FROM intentos_login WHERE correo = $1', [correo]);
          return;
        }
        await cliente.query(
          `INSERT INTO intentos_login (correo, intentos, bloqueado_hasta) VALUES ($1, $2, $3)
           ON CONFLICT (correo) DO UPDATE SET intentos = EXCLUDED.intentos, bloqueado_hasta = EXCLUDED.bloqueado_hasta`,
          [correo, nuevo.intentos, nuevo.bloqueadoHasta],
        );
      });
      await cliente.query('COMMIT');
      return resultado;
    } catch (error) {
      await cliente.query('ROLLBACK');
      throw error;
    } finally {
      cliente.release();
    }
  }
}

export const intentosRepositorio = new PostgresIntentosRepositorio();
