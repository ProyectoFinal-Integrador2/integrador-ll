import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();

router.post('/login', AuthController.login);
router.get('/verify', AuthController.verifyToken);

export default router;
