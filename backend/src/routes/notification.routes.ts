import { Router } from 'express';
import NotificationController from '../controllers/notification.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();
const notificationController = new NotificationController();

router.get('/:user', notificationController.getUserNotifications);
router.put('/status', authMiddleware, notificationController.updateStatusNotifications);
router.delete('/:id/:user', authMiddleware, notificationController.deleteNotification);
router.delete('/:user', authMiddleware, notificationController.deleteAllNotifications);

export default router;
