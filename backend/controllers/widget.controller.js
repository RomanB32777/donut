const db = require('../db')
const stream = require("stream")
const textToSpeech = require('@google-cloud/text-to-speech');

const client = new textToSpeech.TextToSpeechClient();

class WidgetController {
    // alerts
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
            const { text } = req.query

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
        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    } 
}
module.exports = new WidgetController()