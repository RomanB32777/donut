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
            const { creator_id, contract_address } = req.body
            const creator = await db.query('SELECT * FROM users WHERE id = $1', [creator_id])
            if (creator) {
                const newBadge = await db.query(`INSERT INTO badges (creator_id, contract_address) values ($1, $2) RETURNING id`, [creator.rows[0].id, contract_address])
                res.status(200).json(newBadge.rows[0])
            }
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getBadges(req, res) {
        try {
            const { creator_id } = req.params
            const badges = await db.query(`SELECT * FROM badges WHERE creator_id = $1`, [creator_id])
            res.status(200).json(badges.rows)
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getBadge(req, res) {
        try {
            const { badge_id, contract_address } = req.params
            const badges = await db.query(`SELECT * FROM badges WHERE id = $1 AND contract_address= $2`, [badge_id, contract_address])
            res.status(200).json(badges.rows[0])
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async deleteBadge(req, res) {
        try {
            const { badge_id, contract_address } = req.body
            const deletedBadge = await db.query(`DELETE FROM badges WHERE id = $1 AND contract_address= $2 RETURNING *;`, [badge_id, contract_address])
            res.status(200).json(deletedBadge.rows[0])
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    // async createBadgeImage(req, res) {
    //     try {
    //         const badge_id = req.params.badge_id
    //         const file = req.files.file;
    //         const filename = getImageName()
    //         file.mv(`images/${filename + file.name.slice(file.name.lastIndexOf('.'))}`, (err) => { })
    //         await db.query(`UPDATE badges SET badge_image = $1 WHERE id = $2`, [filename + file.name.slice(file.name.lastIndexOf('.')), badge_id])
    //         res.status(200).json({ message: 'success' })
    //     } catch (error) {
    //         res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
    //     }
    // }

    async assignBadge(req, res) {
        try {
            const { id, contract_address, contributor_id } = req.body
            const existingBadge = await db.query('SELECT contributor_user_id_list FROM badges WHERE id = $1 AND contract_address= $2', [id, contract_address])
            const contributor_user_id_list = existingBadge.rows[0].contributor_user_id_list
            const assignedBadge = await db.query('UPDATE badges SET contributor_user_id_list = $1 WHERE id = $2 AND contract_address = $3 RETURNING *', [
                contributor_user_id_list + contributor_id + ' ', id, contract_address
            ])
            res.status(200).json(assignedBadge.rows[0])
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getBadgesHolders(req, res) {
        try {
            const { badge_id, contract_address } = req.params
            const users = await db.query(`SELECT contributor_user_id_list FROM badges WHERE id = $1 AND contract_address= $2`, [badge_id, contract_address])
            if (users.rows && users.rows[0].contributor_user_id_list.length) {
                const usersIDs = users.rows[0].contributor_user_id_list.split(' ').filter(Boolean).join(',');
                const holders = await db.query(`SELECT id, username FROM users WHERE id IN (${usersIDs})`)
                return res.status(200).json(holders.rows)
            }
            res.status(200).json([])
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getBadgesByBacker(req, res) {
        try {
            const { user_id } = req.params
            const badges = await db.query(`SELECT * FROM badges WHERE contributor_user_id_list LIKE '%${user_id}%'`)
            res.status(200).json(badges.rows)
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