import { Router } from 'express';
import DonationController from '../controllers/donation.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();
const donationController = new DonationController();

router.post('/', authMiddleware, donationController.createDonation);
router.get('/supporters/:user_id', authMiddleware, donationController.getSupporters);

// widgets
router.get('/widgets/top-donations/:user_id', donationController.getTopDonations);
router.get('/widgets/latest-donations/:user_id', donationController.getLatestDonations);
router.get('/widgets/top-supporters/:user_id', donationController.getTopSupporters);
router.get('/widgets/stats/:user_id', donationController.getStatsDonations);

// donations page
router.get('/page/:user_id', authMiddleware, donationController.getDonationsData);

// exchanges
router.get('/exchange', donationController.getUsdKoef);

export default router;
