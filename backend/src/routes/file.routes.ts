import { Router } from 'express';
import FileController from '../controllers/file.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();
const fileController = new FileController();

router.get('/default-images/:type', fileController.getDefaultImages)
router.get('/sounds/:username', authMiddleware, fileController.getSounds)

export default router;
