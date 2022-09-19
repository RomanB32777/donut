const Router = require('express')
const router = new Router()

const donationController = require('../controllers/donation.controller')

router.post('/create', donationController.createDonation)
router.get('/supporters/:user_id', donationController.getSupporters)
router.get('/backers-info/', donationController.getBackersInfo)

// widgets
router.get('/widgets/top-donations/:user_id', donationController.getTopDonations)
router.get('/widgets/latest-donations/:user_id', donationController.getLatestDonations)
router.get('/widgets/top-supporters/:user_id', donationController.getTopSupporters)
router.get('/widgets/stats/:user_id', donationController.getStatsDonations)

// donations page
router.get('/page/data/:user_id', donationController.getDonationsData)

module.exports = router