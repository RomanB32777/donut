import { Router } from 'express';
import FileController from '../controllers/file.controller.js';

const router = Router();
const fileController = new FileController();

router.get('/default-images/:type', fileController.getDefaultImages)
router.get('/sounds/:username', fileController.getSounds)

export default router;
