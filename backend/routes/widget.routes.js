const Router = require('express')
const router = new Router()

const widgetController = require('../controllers/widget.controller')

// alerts
router.get('/get-alerts-widget/:creator_id', widgetController.getAlertsWidgetData)
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

// get sound
router.get('/generate/sound', widgetController.generateSound)

module.exports = router