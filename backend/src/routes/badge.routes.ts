import { Router } from 'express';
import BadgeController from '../controllers/badge.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();
const badgeController = new BadgeController();

router.post('/assign-badge', authMiddleware, badgeController.assignBadge);
router.get('/holders/:id', authMiddleware, badgeController.getBadgesHolders);

router.get('/price', badgeController.getMintPrice);
router.get('/:address', authMiddleware, badgeController.getBadges);
router.get('/:id/:address', authMiddleware, badgeController.getBadge);

router.post('/', authMiddleware, badgeController.createBadge);
router.delete('/:id', authMiddleware, badgeController.deleteBadge);

export default router;
