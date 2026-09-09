import express, { Application, Request, Response } from 'express';
import apiRouter from './routes'

const app: Application = express();

app.use(express.json());
app.use('/api/v1', apiRouter); // todas las rutas corresponderán a /api/v1


app.get('/', (req: Request, res: Response) => {
    res.json({message: '¡Servidor Express con TypeScript funcionando :D!!'});
});


export default app;