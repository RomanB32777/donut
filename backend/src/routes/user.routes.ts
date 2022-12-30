import { Router } from 'express';
import UserController from '../controllers/user.controller.js';

const router = Router();
const userController = new UserController();

router.get('/check-username/:username', userController.checkUsername)
router.get('/check-user-exist/:address', userController.checkUserExist)
router.post('/', userController.createUser)
router.delete('/:id', userController.deleteUser)
router.get('/id/:id', userController.getUserByID)
router.get('/creators/:username', userController.getCreatorByName)
router.get('/:address', userController.getUser)
router.put('/edit', userController.editUser)
router.put('/edit-image', userController.editUserImage)
router.put('/edit-creator-image/:type', userController.editCreatorImage)

export default router;
