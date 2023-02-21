import { Router } from 'express';
import WidgetController from '../controllers/widget.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();
const widgetController = new WidgetController();

// alerts
router.get('/alerts-widget/:username/:id?', widgetController.getAlertsWidgetData);
router.put('/alerts-widget', authMiddleware, widgetController.editAlertsWidget);

// sound
router.post('/alerts-widget/sound', authMiddleware, widgetController.uploadSound);
router.get('/sound', widgetController.generateSound);

// goals
router.post('/goals-widget', authMiddleware, widgetController.createGoalWidget);
router.get('/goals-widget/:creator_id', widgetController.getGoalWidgets);
router.get('/goals-widget/:username/:id', widgetController.getGoalWidget);
router.put('/goals-widget', authMiddleware, widgetController.editGoalWidget);
router.delete('/goals-widget/:id', authMiddleware, widgetController.deleteGoalWidget);

// stats
router.post('/stats-widget', authMiddleware, widgetController.createStatWidget);
router.get('/stats-widget/:creator_id', authMiddleware, widgetController.getStatWidgets);
router.get('/stats-widget/:username/:id', widgetController.getStatWidget);
router.put('/stats-widget', authMiddleware, widgetController.editStatWidget);
router.delete('/stats-widget/:id', authMiddleware, widgetController.deleteStatWidget);

export default router;
