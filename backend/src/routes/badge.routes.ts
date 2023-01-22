import { Router } from 'express';
import BadgeController from '../controllers/badge.controller.js';

const router = Router();
const badgeController = new BadgeController();

router.post('/assign-badge', badgeController.assignBadge);
router.get('/holders/:id', badgeController.getBadgesHolders);

router.get('/price', badgeController.getMintPrice);
router.get('/:address', badgeController.getBadges);
router.get('/:id/:address', badgeController.getBadge);

router.post('/', badgeController.createBadge);
router.delete('/:id', badgeController.deleteBadge);

export default router;
