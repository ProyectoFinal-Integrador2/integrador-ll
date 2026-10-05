import { Router } from 'express';
import { KnowledgeController } from '../controllers/knowledge.controller';

const knowledgeRoutes = Router();

knowledgeRoutes.get('/', KnowledgeController.list);

export default knowledgeRoutes;