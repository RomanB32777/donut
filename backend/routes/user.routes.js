const Router = require('express')
const router = new Router()

const userController = require('../controllers/user.controller')

router.post('/check-username', userController.checkUsername)
router.post('/check-user-exist', userController.checkUserExist)
router.post('/create-user', userController.createUser)
router.post('/delete', userController.deleteUser)
router.get('/users/:username', userController.getUsersByName)
router.get('/id/:id', userController.getUserByID)
router.get('/notifications/:user', userController.getUserNotifications)
router.get('/creators/:username/:id', userController.getCreatorByName)
router.get('/:token', userController.getUser)
router.put('/edit', userController.editUser)
router.post('/edit-token/:user_id', userController.editUserWallet)
router.post('/edit-image/:user_id', userController.editUserImage)
router.post('/edit-background/:user_id', userController.editCreatorBackgroundImage)
router.post('/edit-description', userController.editCreatorDescription)
router.get('/get-person-info-supporters/:username', userController.getPersonInfoSupporters)
router.get('/get-person-info-nft/:username', userController.getPersonInfoNFT)
router.post('/follow', userController.follow)
router.post('/unfollow', userController.unfollow)
router.get('/get-follows/:username', userController.getAllFollows)
router.get('/get-followers/:username', userController.getAllFollowers)
router.get('/get-transactions/:username', userController.getAllTransactions)
router.get('/get-alerts-widget/:creator_id', userController.getAlertsWidgetData)
router.put('/edit-alerts-widget', userController.editAlertsWidget)

// goals
router.post('/goals-widget', userController.createGoalWidget)
router.get('/goals-widgets/:creator_id', userController.getGoalWidgets)
router.get('/goals-widget/:id', userController.getGoalWidget)
router.put('/goals-widget', userController.editGoalWidget)
router.delete('/goals-widget/:id', userController.deleteGoalWidget)

// stats
router.post('/stats-widget', userController.createGoalWidget)
router.get('/stats-widgets/:creator_id', userController.getGoalWidgets)
router.get('/stats-widget/:id', userController.getGoalWidget)
router.put('/stats-widget', userController.editGoalWidget)
router.delete('/stats-widget/:id', userController.deleteGoalWidget)


module.exports = router
