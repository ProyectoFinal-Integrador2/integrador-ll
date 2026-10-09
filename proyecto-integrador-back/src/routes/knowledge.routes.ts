import { Router } from 'express';
import { ConocimientoControlador } from '../controllers/knowledge.controller';
import { requerirRol } from '../middlewares/auth';

const knowledgeRoutes = Router();

knowledgeRoutes.get('/', ConocimientoControlador.listar);
knowledgeRoutes.post(
  '/',
  requerirRol('Jefe TI', 'Técnico'),
  ConocimientoControlador.crear,
);

export default knowledgeRoutes;