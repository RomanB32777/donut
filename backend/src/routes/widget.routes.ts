import { Router } from 'express';
import WidgetController from '../controllers/widget.controller.js';

const router = Router();
const widgetController = new WidgetController();

// alerts
router.get('/get-alerts-widget/:creator_id/:security_string', widgetController.getAlertsWidgetData)
router.put('/edit-alerts-widget', widgetController.editAlertsWidget)

// goals
router.post('/goals-widget', widgetController.createGoalWidget)
router.get('/goals-widgets/:creator_id', widgetController.getGoalWidgets)
router.get('/goals-widget/:username/:id', widgetController.getGoalWidget)
router.put('/goals-widget', widgetController.editGoalWidget)
router.delete('/goals-widget/:id', widgetController.deleteGoalWidget)

// stats
router.post('/stats-widget', widgetController.createStatWidget)
router.get('/stats-widgets/:creator_id', widgetController.getStatWidgets)
router.get('/stats-widget/:id', widgetController.getStatWidget)
router.put('/stats-widget', widgetController.editStatWidget)
router.delete('/stats-widget/:id', widgetController.deleteStatWidget)

// sound
router.get('/sound/generate', widgetController.generateSound)
router.post('/sound', widgetController.uploadSound)

export default router;