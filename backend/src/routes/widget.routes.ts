import { Router } from 'express';
import WidgetController from '../controllers/widget.controller.js';

const router = Router();
const widgetController = new WidgetController();

// alerts
router.get('/alerts-widget/:username/:id?', widgetController.getAlertsWidgetData)
router.put('/alerts-widget', widgetController.editAlertsWidget)

// sound
router.post('/alerts-widget/sound', widgetController.uploadSound)
router.get('/sound', widgetController.generateSound)

// goals
router.post('/goals-widget', widgetController.createGoalWidget)
router.get('/goals-widget/:creator_id', widgetController.getGoalWidgets)
router.get('/goals-widget/:username/:id', widgetController.getGoalWidget)
router.put('/goals-widget', widgetController.editGoalWidget)
router.delete('/goals-widget/:id', widgetController.deleteGoalWidget)

// stats
router.post('/stats-widget', widgetController.createStatWidget)
router.get('/stats-widget/:creator_id', widgetController.getStatWidgets)
router.get('/stats-widget/:username/:id', widgetController.getStatWidget)
router.put('/stats-widget', widgetController.editStatWidget)
router.delete('/stats-widget/:id', widgetController.deleteStatWidget)

export default router;