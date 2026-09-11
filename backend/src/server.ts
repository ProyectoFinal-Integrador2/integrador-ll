import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Registro de rutas API
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.info(`[Backend] Servidor ejecutándose en el puerto ${PORT}`);
  });
}
