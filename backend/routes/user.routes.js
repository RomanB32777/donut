const Router = require('express')
const router = new Router()

const userController = require('../controllers/user.controller')

router.post('/check-username', userController.checkUsername)
router.post('/check-user-exist', userController.checkUserExist)
router.post('/create-user', userController.createUser)
router.post('/delete', userController.deleteUser)
router.get('/id/:id', userController.getUserByID)
router.get('/notifications/:user', userController.getUserNotifications)
router.put('/notifications/status', userController.updateStatusNotifications)
router.get('/creators/:username', userController.getCreatorByName)
router.get('/:token', userController.getUser)
router.put('/edit', userController.editUser)
router.post('/edit-token/:user_id', userController.editUserWallet)
router.post('/edit-image/:user_id', userController.editUserImage)
router.post('/edit-background/:user_id', userController.editCreatorBackgroundImage)


module.exports = router
