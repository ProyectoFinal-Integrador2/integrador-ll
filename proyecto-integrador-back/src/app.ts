import cors from 'cors';
import express, { type Application, type Request, type Response } from 'express';
import { errorHandler } from '../#8/back/src/middlewares/errorHandler';
import { notFound } from '../#8/back/src/middlewares/notFound';
import apiRouter from '../#8/back/src/routes';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1', apiRouter); // todas las rutas corresponderán a /api/v1

app.get('/', (req: Request, res: Response) => {
  res.json({ message: '¡Servidor Express con TypeScript funcionando :D!!' });
});

app.use(notFound);
app.use(errorHandler);

export default app;
