import cors from 'cors';
import express, { type Application, type Request, type Response } from 'express';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import apiRouter from './routes';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1', apiRouter); // todas las rutas corresponderán a /api/v1

app.get('/', (req: Request, res: Response) => {
  res.json({ message: '¡Servidor Express con TypeScript funcionando :D!!' });
});

// notFound y errorHandler van al final: solo se ejecutan si ninguna ruta
// anterior respondio.
app.use(notFound);
app.use(errorHandler);

export default app;
