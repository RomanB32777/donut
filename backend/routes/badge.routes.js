const Router = require('express')
const router = new Router()

const badgeController = require('../controllers/badge.controller')

router.get('/:creator_id', badgeController.getBadges)
router.get('/:badge_id/:contract_address', badgeController.getBadge)
router.post('/', badgeController.createBadge)
router.delete('/', badgeController.deleteBadge)

// router.post('/create-image/:badge_id', badgeController.createBadgeImage)
router.post('/assign-badge', badgeController.assignBadge)
router.get('/holders/:badge_id/:contract_address', badgeController.getBadgesHolders)


// router.get('/get-badges-by-backer/:user_id', badgeController.getBadgesByBacker)

module.exports = router