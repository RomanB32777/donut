import { Router } from 'express';
import NotificationController from '../controllers/notification.controller.js';

const router = Router();
const notificationController = new NotificationController();

router.get('/:user', notificationController.getUserNotifications)
router.put('/status', notificationController.updateStatusNotifications)
router.delete('/:id', notificationController.deleteNotification)
router.delete('/', notificationController.deleteAllNotifications)

export default router;
