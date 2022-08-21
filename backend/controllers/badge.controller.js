const db = require('../db')

const getImageName = () => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 32; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result
}


class BadgeController {
    async createBadge(req, res) {
        try {
            const { token, badge_name, badge_desc, link, quantity } = req.body
            const creator = await db.query('SELECT * FROM users WHERE tron_token = $1 OR metamask_token = $1', [token])
            if (creator) {
                const newBadge = await db.query(`INSERT INTO badges (owner_user_id, badge_name, badge_desc, link, quantity) values ($1, $2, $3, $4, $5) RETURNING *`, [creator.rows[0].id, badge_name, badge_desc, link, quantity])
                res.status(200).json({ badge: newBadge.rows[0] })
            }
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async deleteBadge(req, res) {
        try {
            const { badge_id } = req.body
            const deletedBadge = await db.query(`DELETE FROM badges WHERE id = $1 RETURNING *;`, [badge_id])
            res.status(200).json({ deletedBadge: deletedBadge.rows[0] })
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async createBadgeImage(req, res) {
        try {
            const badge_id = req.params.badge_id
            const file = req.files.file;
            const filename = getImageName()
            file.mv(`images/${filename + file.name.slice(file.name.lastIndexOf('.'))}`, (err) => { })
            await db.query(`UPDATE badges SET badge_image = $1 WHERE id = $2`, [filename + file.name.slice(file.name.lastIndexOf('.')), badge_id])
            res.status(200).json({ message: 'success' })
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async assignBadge(req, res) {
        try {
            const { badge_id, quantity, contributor_id } = req.body
            const existingBadge = await db.query('SELECT contributor_user_id_list, owners_quantity FROM badges WHERE id = $1', [badge_id])
            const contributor_user_id_list = existingBadge.rows[0].contributor_user_id_list
            const owners_quantity = existingBadge.rows[0].owners_quantity
            if (owners_quantity < quantity) {
                const assignedBadge = await db.query('UPDATE badges SET owners_quantity = $1, contributor_user_id_list = $2 WHERE id = $3 RETURNING *', [owners_quantity + 1, contributor_user_id_list + contributor_id + ' ', badge_id])
                res.json({ assignedBadge: assignedBadge.rows[0] })
            } else {
                res.json({ success: false })
            }
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getBadgesByBacker(req, res) {
        try {
            const user_id = req.params.user_id
            const badges = await db.query(`SELECT * FROM badges WHERE contributor_user_id_list LIKE '%${user_id}%'`)
            res.status(200).json({ badges: badges.rows })
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getBadgesByCreator(req, res) {
        try {
            const user_id = req.params.user_id

            const badges = await db.query('SELECT * FROM badges WHERE owner_user_id = $1', [parseInt(user_id)])
            res.status(200).json({ badges: badges.rows })
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }
}
module.exports = new BadgeController()