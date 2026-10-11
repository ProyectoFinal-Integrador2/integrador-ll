import { Router } from 'express';
import { queryOne } from '../../../../proyecto-integrador-back/src/config/db';

const healthRoutes = Router();

/** GET /api/v1/health — comprueba que el proceso y la base responden. */
healthRoutes.get('/', async (_req, res) => {
  try {
    await queryOne<{ uno: number }>('select 1 as uno');
    res.json({ status: 'ok', database: 'ok' });
  } catch {
    res.status(503).json({ status: 'error', database: 'error' });
  }
});

export default healthRoutes;