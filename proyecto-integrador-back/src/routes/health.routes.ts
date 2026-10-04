import { Router } from 'express';

const healthRoutes = Router();

/** GET /api/v1/health — comprueba que el proceso responde. */
healthRoutes.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});

export default healthRoutes;
