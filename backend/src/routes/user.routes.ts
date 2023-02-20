import { Router } from 'express';
import UserController from '../controllers/user.controller.js';

const router = Router();
const userController = new UserController();

router.get('/check-user-exist/:field', userController.checkUserExist)
router.post('/', userController.createUser)
router.delete('/:id', userController.deleteUser)
router.get('/id/:id', userController.getUserByID)
router.get('/creators/:username', userController.getCreatorByName)
router.get('/:address', userController.getUser)
router.put('/edit-image', userController.editUserImage)
router.put('/edit-creator-image/:type', userController.editCreatorImage)
router.put('/', userController.editUser)

export default router;
