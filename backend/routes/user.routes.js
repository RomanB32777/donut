const Router = require('express')
const router = new Router()

const userController = require('../controllers/user.controller')

router.post('/check-username', userController.checkUsername)
router.post('/check-user-exist', userController.checkUserExist)
router.post('/create-user', userController.createUser)
router.post('/delete', userController.deleteUser)
router.get('/users/:username', userController.getUsersByName)
router.get('/:id', userController.getUserByID)
router.get('/notifications/:user', userController.getUserNotifications)
router.get('/creators/:username/:id', userController.getCreatorByName)
router.get('/:token', userController.getUser)
router.post('/user/edit', userController.editUser)
router.post('/edit-token/:user_id', userController.editUserWallet)
router.post('/user/edit-image/:user_id', userController.editUserImage)
router.post('/user/edit-background/:user_id', userController.editCreatorBackgroundImage)
router.post('/user/edit-description', userController.editCreatorDescription)
router.get('/get-person-info-supporters/:username', userController.getPersonInfoSupporters)
router.get('/get-person-info-nft/:username', userController.getPersonInfoNFT)
router.post('/follow', userController.follow)
router.post('/unfollow', userController.unfollow)
router.get('/get-follows/:username', userController.getAllFollows)
router.get('/get-followers/:username', userController.getAllFollowers)
router.get('/get-transactions/:username', userController.getAllTransactions)

module.exports = router
