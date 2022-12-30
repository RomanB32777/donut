import { Router } from 'express';
import BadgeController from '../controllers/badge.controller.js';

const router = Router();
const badgeController = new BadgeController();

router.get('/badges-backer/:user_id', badgeController.getBadgesByBacker);
router.post('/assign-badge', badgeController.assignBadge);
router.get('/holders/:badge_id/:contract_address', badgeController.getBadgesHolders);

router.get('/:creator_id', badgeController.getBadges);
router.get('/:badge_id/:contract_address', badgeController.getBadge);
router.post('/', badgeController.createBadge);
router.delete('/:badge_id/:contract_address', badgeController.deleteBadge);

export default router;
