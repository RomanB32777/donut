const axios = require("axios");

const db = require('../db')

const fs = require('fs')

const util = require('util');

// import { PassThrough } from "stream";

const stream = require("stream")

// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
require('dotenv').config();

const client = new textToSpeech.TextToSpeechClient();

const getTronUsdKoef = async () => {
    const res = await axios.get(
        "https://www.binance.com/api/v3/ticker/price?symbol=TRXUSDT"
    );
    return res.data.price;
};

const getMaticUsdKoef = async () => {
    const res = await axios.get(
        "https://www.binance.com/api/v3/ticker/price?symbol=MATICUSDT"
    );
    return res.data.price;
};

const getRandomStr = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result
}

const getSubscriptions = async (username) => {
    const follows = await db.query('SELECT * FROM follows WHERE backer_username = $1', [username])
    let data = []
    let names = []
    if (follows && follows.rows.length > 0) {
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
            const { token } = req.body
            const user = await db.query('SELECT * FROM users WHERE tron_token = $1 OR metamask_token = $1', [token])
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
            const { username, token, role, typeWallet } = req.body
            const date = new Date()
            const newUser = await db.query(`INSERT INTO users (${typeWallet}_token, username, roleplay) values ($1, $2, $3) RETURNING *;`, [token, username.toLowerCase(), role])
            if (role === 'creators') {
                const security_string = getRandomStr(10)
                await db.query(`INSERT INTO creators (username, user_id, creation_date, security_string) values ($1, $2, $3, $4) RETURNING *`, [username.toLowerCase(), newUser.rows[0].id, date, security_string])
                const alertID = getRandomStr(6)
                await db.query(`INSERT INTO alerts (id, creator_id) values ($1, $2) RETURNING *`, [alertID, newUser.rows[0].id]);
                res.status(200).json({ message: 'Creator created!' })
            } else {
                await db.query(`INSERT INTO backers (username, user_id, creation_date) values ($1, $2, $3) RETURNING *`, [username.toLowerCase(), newUser.rows[0].id, date])
                res.status(200).json({ message: 'Backer created!', newUser: newUser.rows[0] })
            }
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async deleteUser(req, res) {
        try {
            const { user_id } = req.body
            const deletedUser = await db.query(`DELETE FROM users WHERE id = $1 RETURNING *;`, [user_id])
            res.status(200).json({ deletedUser: deletedUser.rows[0] })
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getUser(req, res) {
        try {
            const token = req.params.token
            const user = await db.query('SELECT * FROM users WHERE tron_token = $1 OR metamask_token = $1', [token])
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

    async getUserByID(req, res) {
        try {
            const id = req.params.id
            const user = await db.query(`SELECT * FROM users WHERE id = $1`, [id])
            res.status(200).json({ user: user.rows[0] })
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getUserNotifications(req, res) {
        try {
            let notificationsAll = []
            const user = req.params.user
            let notifications = {}
            if (typeof user === 'string' && user.includes("@"))
                notifications = await db.query(`SELECT * FROM notifications WHERE senderName = $1 OR recipientName = $1 ORDER BY creation_date DESC`, [user])
            else
                notifications = await db.query(`SELECT * FROM notifications WHERE sender = $1 OR recipient = $1 ORDER BY creation_date DESC`, [user])

            if (notifications && notifications.rows.length) {
                notificationsAll = await Promise.all(notifications.rows.map(async n => {
                    if (n.donation) {
                        const donation = await db.query(`SELECT * FROM donations WHERE id = $1`, [n.donation]);
                        if (donation.rows[0]) return { ...n, donation: donation.rows[0] }
                        return n;
                    }
                    if (n.follow) {
                        const follow = await db.query(`SELECT * FROM follows WHERE id = $1`, [n.follow]);
                        if (follow.rows[0]) return { ...n, follow: follow.rows[0] }
                        return n;
                    }
                    if (n.badge) {
                        const badge = await db.query(`SELECT * FROM badges WHERE id = $1`, [n.badge]);
                        const creator = await db.query(`SELECT username FROM users WHERE id = $1`, [n.sender]);
                        const supporter = await db.query(`SELECT username FROM users WHERE id = $1`, [n.recipient]);
                        if (badge.rows[0] && creator.rows[0] && supporter.rows[0]) return { ...n, badge: { ...badge.rows[0], supporter_username: supporter.rows[0].username, creator_username: creator.rows[0].username } }
                        return n;
                    }
                }))
                res.status(200).json({ notifications: notificationsAll })
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
                const follow = await db.query(`SELECT * FROM follows WHERE creator_id = $1 AND backer_id = $2`, [creator.rows[0].id, id])
                following = (follow.rows && follow.rows[0] && (follow.rows[0].backer_id === id)) ? true : false
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
            const {
                welcome_text,
                btn_text,
                main_color,
                background_color,
                username,
                user_id,
            } = req.body;
            let editedUser = {}
            let table = 'backers'
            const user = await db.query(`SELECT * FROM users WHERE id = $1`, [user_id])

            if (user.rows[0].roleplay === 'creators') {
                table = 'creators'
            }
            if (table = 'creators') {
                const editedDBUser = await db.query(`UPDATE ${table} SET welcome_text = $1, btn_text = $2, main_color = $3, background_color = $4 WHERE user_id = $5 RETURNING *`, [
                    welcome_text,
                    btn_text,
                    main_color,
                    background_color,
                    user.rows[0].id
                ])
                editedUser = editedDBUser.rows[0]
            }

            if (username) {
                const editedUsername = await db.query(`UPDATE users SET username = $1 WHERE id = $2 RETURNING *`, [
                    username,
                    user.rows[0].id
                ])
                editedUser = { ...editedUser, username: editedUsername.rows[0].username }
            }
            res.status(200).json({ editedUser })
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async editUserWallet(req, res) {
        try {
            const { user_id } = req.params
            const { type_wallet, token } = req.body
            if (type_wallet && token && user_id) {
                const editedUser = await db.query(`UPDATE users SET ${type_wallet}_token = $1 WHERE id = $2 RETURNING *`, [token, user_id])
                res.status(200).json(editedUser)
            } else {
                res.status(500).json({ error: true, message: 'Something broke!' })
            }
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async editUserImage(req, res) {
        try {
            const user_id = req.params.user_id
            const file = req.files.file;
            const filename = getRandomStr(32)
            file.mv(`images/${filename + file.name.slice(file.name.lastIndexOf('.'))}`, (err) => { })
            const user = await db.query(`SELECT * FROM users WHERE id = $1`, [user_id])
            let table = 'backers'
            if (user.rows[0].roleplay === 'creators') {
                table = 'creators'
            }
            await db.query(`UPDATE ${table} SET avatarlink = $1 WHERE user_id = $2`, [filename + file.name.slice(file.name.lastIndexOf('.')), user.rows[0].id])
            res.status(200).json({ message: 'success' })
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async editCreatorBackgroundImage(req, res) {
        try {
            const user_id = req.params.user_id
            const file = req.files.file;
            const filename = getRandomStr(32)
            file.mv(`images/${filename + file.name.slice(file.name.lastIndexOf('.'))}`, (err) => { })
            const user = await db.query(`SELECT * FROM users WHERE id = $1`, [user_id])
            let table = 'backers'
            if (user.rows[0].roleplay === 'creators') {
                table = 'creators'
            }
            await db.query(`UPDATE ${table} SET backgroundlink = $1 WHERE user_id = $2`, [filename + file.name.slice(file.name.lastIndexOf('.')), user.rows[0].id])
            res.status(200).json({ message: 'success' })
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async editCreatorDescription(req, res) {
        try {
            const { user_id, description } = req.body
            const user = await db.query(`SELECT * FROM users WHERE id = $1`, [user_id])
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

            const trxKoef = await getTronUsdKoef();
            const maticKoef = await getMaticUsdKoef();

            const user = await db.query(`SELECT * FROM users WHERE username = $1`, [username])
            // const creator = await db.query(`SELECT * FROM creators WHERE username = $1`, [username])
            // const supporters = await db.query(`SELECT * FROM supporters WHERE creator_id = $1 ORDER BY sum_donations DESC`, [user.rows[0].id])
            const supporters = await db.query(`
                SELECT username, SUM(sum_donation::numeric * CASE WHEN donations.wallet_type IN ('tron') THEN ${trxKoef} ELSE ${maticKoef} END) AS sum_donations
                FROM donations
                WHERE creator_id = $1
                GROUP BY username
                ORDER BY sum_donations DESC`, [user.rows[0].id])

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
            res.status(200).json({ follow: follow.rows[0] })
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


    async editAlertsWidget(req, res) {
        try {
            const { alertData, creator_id } = req.body
            let updatedWidget = {}

            const parseData = JSON.parse(alertData)
            const updatedDBWidget = await db.query(`UPDATE alerts SET 
                message_color = $1,
                name_color = $2,
                sum_color = $3,
                duration = $4,
                sound = $5,
                voice = $6
                WHERE creator_id = $7 RETURNING *;`, [
                ...Object.values(parseData),
                creator_id
            ])
            updatedWidget = updatedDBWidget.rows[0];

            if (req.files) {
                const file = req.files.file;
                const filename = getRandomStr(32) + file.name.slice(file.name.lastIndexOf('.'));
                file.mv(`images/${filename}`, (err) => { })
                const updatedBannerWidget = await db.query(`UPDATE alerts SET 
                    banner_link = $1
                    WHERE creator_id = $2 RETURNING *;`, [
                    filename,
                    creator_id
                ])
                updatedWidget = { ...updatedWidget, banner_link: updatedBannerWidget.rows[0].banner_link };
            }
            res.status(200).json({ alertData: updatedWidget }) //
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getAlertsWidgetData(req, res) {
        try {
            const creator_id = req.params.creator_id
            const data = await db.query('SELECT * FROM alerts WHERE creator_id = $1', [creator_id])
            res.status(200).json(data.rows[0])
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }


    // goals
    async createGoalWidget(req, res) {
        try {
            const { title, amount_goal, creator_id } = req.body
            const id = getRandomStr(6)
            const newGoalWidget = await db.query(
                `INSERT INTO goals (id, title, amount_goal, creator_id) values ($1, $2, $3, $4) RETURNING *;`, [
                id, title, amount_goal, creator_id
            ])
            res.status(200).json(newGoalWidget.rows[0])
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getGoalWidgets(req, res) {
        try {
            const creator_id = req.params.creator_id;
            const data = await db.query('SELECT * FROM goals WHERE creator_id = $1', [creator_id])
            res.status(200).json(data.rows)
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getGoalWidget(req, res) {
        try {
            const { username, id } = req.params;
            const user = await db.query('SELECT id FROM users WHERE username = $1', [username])
            if (user.rows[0]) {
                const data = await db.query('SELECT * FROM goals WHERE creator_id = $1 AND id = $2', [user.rows[0].id, id])
                res.status(200).json(data.rows[0])
            } else res.status(200).json({})
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async editGoalWidget(req, res) {
        try {
            const { goalData, creator_id, id } = req.body

            if (goalData.donat) {
                const goalWidget = await db.query('SELECT id, amount_raised, amount_goal FROM goals WHERE creator_id = $1 AND id = $2', [creator_id, id])
                if (goalWidget.rows[0]) {
                    const { amount_raised, amount_goal, id } = goalWidget.rows[0];
                    const updated_amount_raised = Number(amount_raised) + goalData.donat <= Number(amount_goal)
                        ? Number(amount_raised) + goalData.donat : Number(amount_goal)
                    let updatedGoalWidget = await db.query(`UPDATE goals SET 
                        amount_raised = $1
                        WHERE id = $2 RETURNING *;`, [Number(updated_amount_raised.toFixed(2)), id]);

                    if (updated_amount_raised === Number(amount_goal))
                        updatedGoalWidget = await db.query(`UPDATE goals SET 
                        isArchive = $1
                        WHERE id = $2 RETURNING *;`, [true, id]);

                    res.status(200).json(updatedGoalWidget.rows[0])
                }
            } else if (goalData.title) {
                const updatedGoalWidget = await db.query(`UPDATE goals SET 
                    title = $1,
                    amount_goal = $2
                    WHERE creator_id = $3 AND id = $4 RETURNING *;`, [
                    ...Object.values(goalData),
                    creator_id,
                    id
                ]);
                res.status(200).json(updatedGoalWidget.rows[0])

            } else {
                const updatedGoalWidget = await db.query(`UPDATE goals SET 
                    title_color = $1,
                    progress_color = $2,
                    background_color = $3
                    WHERE creator_id = $4 AND id = $5 RETURNING *;`, [
                    ...Object.values(goalData),
                    creator_id,
                    id
                ]);
                res.status(200).json(updatedGoalWidget.rows[0])
            }
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async deleteGoalWidget(req, res) {
        try {
            const id = req.params.id
            const deletedGoalWidget = await db.query(`DELETE FROM goals WHERE id = $1 RETURNING *;`, [id])
            res.status(200).json(deletedGoalWidget.rows[0])
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }


    // stats
    async createStatWidget(req, res) {
        try {
            const {
                title,
                stat_description,
                template,
                data_type,
                time_period,
                creator_id
            } = req.body
            const id = getRandomStr(6)
            const newStatWidget = await db.query(`INSERT INTO stats (id, title, stat_description, template, data_type, time_period, creator_id) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`, [
                id,
                title,
                stat_description,
                template,
                data_type,
                time_period,
                creator_id
            ])
            res.status(200).json(newStatWidget.rows[0])
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getStatWidgets(req, res) {
        try {
            const creator_id = req.params.creator_id;
            const data = await db.query('SELECT * FROM stats WHERE creator_id = $1', [creator_id])
            res.status(200).json(data.rows)
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getStatWidget(req, res) {
        try {
            const id = req.params.id;
            const data = await db.query('SELECT * FROM stats WHERE id = $1', [id])
            res.status(200).json(data.rows[0])
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async editStatWidget(req, res) {
        try {
            const { statData, id } = req.body

            if (statData.title) {
                const updatedStatWidget = await db.query(`UPDATE stats SET 
                        title = $1,
                        stat_description = $2,
                        template = $3,
                        data_type = $4,
                        time_period = $5
                        WHERE id = $6 RETURNING *;`, [
                    ...Object.values(statData),
                    id
                ]);
                res.status(200).json(updatedStatWidget.rows[0])

            } else {
                const updatedStatWidget = await db.query(`UPDATE stats SET 
                        title_color = $1,
                        bar_color = $2,
                        content_color = $3,
                        aligment = $4
                        WHERE id = $5 RETURNING *;`, [
                    ...Object.values(statData),
                    id
                ]);
                res.status(200).json(updatedStatWidget.rows[0])
            }
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async deleteStatWidget(req, res) {
        try {
            const id = req.params.id
            const deletedStatWidget = await db.query(`DELETE FROM stats WHERE id = $1 RETURNING *;`, [id])
            res.status(200).json(deletedStatWidget.rows[0])
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async generateSound(req, res) {
        try {
            const { text } = req.body

            const request = {
                input: { text },
                voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
                audioConfig: { audioEncoding: 'MP3' },
            }

            res.set({
                'Content-Type': 'audio/mpeg',
                'Transfer-Encoding': 'chunked'
            })

            

            const [response] = await client.synthesizeSpeech(request)
            const bufferStream = new stream.PassThrough()
            bufferStream.end(Buffer.from(response.audioContent))
            bufferStream.pipe(res)
            console.log("success");

            // const [response] = await client.synthesizeSpeech(request);
            // Write the binary audio content to a local file
            // const writeFile = util.promisify(fs.writeFile);
            // await writeFile('output.mp3', response.audioContent, 'binary');
            // console.log('Audio content written to file: output.mp3', response);

        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }
}

module.exports = new UserController()