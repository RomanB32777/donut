import { Router } from 'express';
import UserController from '../controllers/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();
const userController = new UserController();

router.get('/check-user-exist/:field', userController.checkUserExist)
router.post('/', authMiddleware, userController.createUser)
router.delete('/:id', authMiddleware, userController.deleteUser)
router.get('/id/:id', authMiddleware, userController.getUserByID)
router.get('/creators/:username', userController.getCreatorByName)
router.get('/:address', authMiddleware, userController.getUser)
router.put('/edit-image', authMiddleware, userController.editUserImage)
router.put('/edit-creator-image/:type', authMiddleware, userController.editCreatorImage)
router.put('/', authMiddleware, userController.editUser)

export default router;
