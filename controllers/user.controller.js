const db = require('../db')

const fs = require('fs')

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

const getSubscriptions = async (username) => {
    const follows = await db.query('SELECT * FROM follows WHERE backer_username = $1', [username])
    let data = []
    let names = []
    if (follows.rows.length > 0) {
        names = follows.rows.map((follow) => (follow.creator_username))
        const creators = await db.query('SELECT * FROM creators WHERE username = ANY ($1)', [[names]])
        follows.rows.forEach((follow) => {
            creators.rows.forEach((creator) => {
                if (follow.creator_username === creator.username) {
                    data.push({
                        ...creator,
                        ...follow
                    })
                }
            })

        })
    }
    return data
}

class UserController {
    async checkUsername(req, res) {
        try {
            const { username } = req.body
            const user = await db.query('SELECT * FROM users WHERE username = $1', [username])
            if (user.rows.length > 0 && user.rows[0].username === username) {
                res.status(200).json({ error: true })
            } else {
                res.status(200).json({ error: false })
            }
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async checkUserExist(req, res) {
        try {
            const { tron_token } = req.body
            const user = await db.query('SELECT * FROM users WHERE tron_token = $1', [tron_token])
            if (user.rows && user.rows.length === 0) {
                res.status(200).json({ notExist: true })
            } else {
                res.status(200).json(user.rows[0])
            }
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async createUser(req, res) {
        try {
            const { username, tron_token, role } = req.body
            const date = new Date()
            const newUser = await db.query(`INSERT INTO users (tron_token, username, roleplay) values ($1, $2, $3) RETURNING *;`, [tron_token, username.toLowerCase(), role])
            if (role === 'creators') {
                await db.query(`INSERT INTO creators (username, user_id, creation_date) values ($1, $2, $3) RETURNING *`, [username.toLowerCase(), newUser.rows[0].id, date])
                res.status(200).json({ message: 'Creator created!' })
            } else {
                await db.query(`INSERT INTO backers (username, user_id, creation_date) values ($1, $2, $3) RETURNING *`, [username.toLowerCase(), newUser.rows[0].id, date])
                res.status(200).json({ message: 'Backer created!' })
            }
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getUser(req, res) {
        try {
            const tron_token = req.params.tron_token
            const user = await db.query('SELECT * FROM users WHERE tron_token = $1', [tron_token])
            if (user.rows[0] && user.rows[0].id) {
                const subscriptions = await getSubscriptions(user.rows[0].username)
                const role = await db.query(`SELECT * FROM ${user.rows[0].roleplay} WHERE user_id = $1`, [user.rows[0].id])
                res.status(200).json({ ...role.rows[0], ...user.rows[0], subscriptions })
            } else {
                res.status(200).json({})
            }
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getUsersByName(req, res) {
        try {
            const username = req.params.username
            if (username === 'all') {
                const users = await db.query(`SELECT * FROM creators`)
                res.status(200).json(users.rows)
            } else {
                const users = await db.query(`SELECT * FROM creators WHERE username LIKE '%${username.toLowerCase()}%'`)
                res.status(200).json(users.rows)
            }
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getCreatorByName(req, res) {
        try {
            const username = req.params.username
            const id = req.params.id
            const users = await db.query(`SELECT * FROM users WHERE roleplay = 'creators' AND username LIKE '%${username.toLowerCase()}%'`)
            const creator = await db.query(`SELECT * FROM creators WHERE username = $1`, [username.toLowerCase()])
            let following = false
            if (id && creator.rows[0]) {
                console.log(creator.rows[0].id + '    ' + id)
                const follow = await db.query(`SELECT * FROM follows WHERE creator_id = $1 AND backer_id = $2`, [creator.rows[0].id, id])
                console.log(follow.rows)
                following = (follow.rows && follow.rows[0] && (follow.rows[0].backer_id === id)) ? true : false
                console.log(following)
            }

            res.status(200).json({
                ...users.rows[0],
                ...creator.rows[0],
                following: following,
            })
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async editUser(req, res) {
        try {
            const { tron_token, person_name, twitter, google, facebook, discord } = req.body
            const user = await db.query(`SELECT * FROM users WHERE tron_token = $1`, [tron_token])
            console.log(person_name)
            let table = 'backers'
            if (user.rows[0].roleplay === 'creators') {
                table = 'creators'
            }
            const editedUser = await db.query(`UPDATE ${table} SET person_name = $1, twitter = $2, google = $3, facebook = $4, discord = $5 WHERE user_id = $6 RETURNING *`, [person_name, twitter, google, facebook, discord, user.rows[0].id])
            res.json(editedUser)
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async editUserImage(req, res) {
        try {
            const tron_token = req.params.tron_token
            const file = req.files.file;
            const filename = getImageName()
            file.mv(`images/${filename + file.name.slice(file.name.lastIndexOf('.'))}`, (err) => { })
            const user = await db.query(`SELECT * FROM users WHERE tron_token = $1`, [tron_token])
            let table = 'backers'
            if (user.rows[0].roleplay === 'creators') {
                table = 'creators'
            }
            await db.query(`UPDATE ${table} SET avatarlink = $1 WHERE user_id = $2`, [filename + file.name.slice(file.name.lastIndexOf('.')), user.rows[0].id])
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async editCreatorBackgroundImage(req, res) {
        try {
            const tron_token = req.params.tron_token
            const file = req.files.file;
            const filename = getImageName()
            file.mv(`images/${filename + file.name.slice(file.name.lastIndexOf('.'))}`, (err) => { })
            const user = await db.query(`SELECT * FROM users WHERE tron_token = $1`, [tron_token])
            let table = 'backers'
            if (user.rows[0].roleplay === 'creators') {
                table = 'creators'
            }
            console.log(file.name.slice(file.name.lastIndexOf('.')))
            await db.query(`UPDATE ${table} SET backgroundlink = $1 WHERE user_id = $2`, [filename + file.name.slice(file.name.lastIndexOf('.')), user.rows[0].id])
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async editCreatorDescription(req, res) {
        try {
            const { tron_token, description } = req.body
            const user = await db.query(`SELECT * FROM users WHERE tron_token = $1`, [tron_token])
            const editedCreator = await db.query('UPDATE creators SET user_description = $1 WHERE user_id = $2 RETURNING *', [description, user.rows[0].id])
            if (editedCreator.rows[0].user_id === user.rows[0].id) {
                res.status(200).json({ message: 'success' })
            }
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getPersonInfoSupporters(req, res) { // неправильный подсчет суммы иногда !
        try {
            const username = req.params.username
            const user = await db.query(`SELECT * FROM users WHERE username = $1`, [username])
            // const creator = await db.query(`SELECT * FROM creators WHERE username = $1`, [username])
            // const supporters = await db.query(`SELECT * FROM supporters WHERE creator_id = $1 ORDER BY sum_donations DESC`, [user.rows[0].id])
            const supporters = await db.query(`
                SELECT username, SUM(sum_donation::integer) AS sum_donations
                FROM donations
                WHERE creator_id = $1
                GROUP BY username
                ORDER BY sum_donations DESC`, [user.rows[0].id])
            console.log(supporters.rows);

            const lastdonations = await db.query(`SELECT * FROM donations WHERE creator_id = $1`, [user.rows[0].id])

            res.json({
                data: {
                    supporters: supporters.rows.slice(0, 5),
                    donations: lastdonations.rows.reverse(),
                    // creator: {...user.rows[0], ...creator.rows[0]}
                }
            })
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getPersonInfoNFT(req, res) {
        try {
            const username = req.params.username
            const user = await db.query(`SELECT * FROM users WHERE username = $1`, [username])
            const nfts = await db.query(`SELECT * FROM nft WHERE creator_id = $1`, [user.rows[0].id])
            res.json({ data: nfts.rows })
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async follow(req, res) {
        try {
            const { creator_id, creator_username, backer_id, backer_username } = req.body
            const follow = await db.query('INSERT INTO follows (creator_id, creator_username, backer_id, backer_username) values ($1, $2, $3, $4) RETURNING *', [creator_id, creator_username, backer_id, backer_username])
            res.status(200).json(follow)
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async unfollow(req, res) {
        try {
            const { id } = req.body
            const unfollowObj = await db.query('DELETE FROM follows WHERE id = $1 RETURNING *', [id])
            res.status(200).json({ error: false, message: `You unfollowed ${unfollowObj.rows[0].creator_username}!` })
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getAllFollows(req, res) {
        try {
            const username = req.params.username
            const data = await getSubscriptions(username)
            res.status(200).json(data)
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getAllFollowers(req, res) {
        try {
            const username = req.params.username
            const data = await db.query('SELECT * FROM follows WHERE creator_username = $1', [username])
            if (data && data.rows && data.rows.length > 0) {
                res.status(200).json(data.rows)
            } else {
                res.status(200).json([])
            }
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getAllTransactions(req, res) {
        try {
            const username = req.params.username
            const data = await db.query('SELECT * FROM donations WHERE username = $1', [username])
            if (data && data.rows && data.rows.length > 0) {
                res.status(200).json(data.rows)
            } else {
                res.status(200).json([])
            }
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }
}

module.exports = new UserController()