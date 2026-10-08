import { Router } from 'express';
import { ConocimientoControlador } from '../controllers/knowledge.controller';

const knowledgeRoutes = Router();

knowledgeRoutes.get('/', ConocimientoControlador.listar);

export default knowledgeRoutes;