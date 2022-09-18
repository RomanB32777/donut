const axios = require("axios");

const db = require('../db')

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

class DonationController {
    async createDonation(req, res) {
        try {
            const { creator_token, backer_token, donation_message, sum, wallet } = req.body

            const initDate = new Date()
            // initDate.setDate(initDate.getDate() - 4);
            const formatedDate = initDate.getTime()
            const userOffset = -initDate.getTimezoneOffset() * 60 * 1000
            const date = new Date(formatedDate + userOffset).toISOString()

            const trxKoef = await getTronUsdKoef();
            const maticKoef = await getMaticUsdKoef();

            if (backer_token && creator_token) {
                const creator = await db.query('SELECT * FROM users WHERE tron_token = $1 OR metamask_token = $1', [creator_token])
                const backer = await db.query('SELECT * FROM users WHERE tron_token = $1 OR metamask_token = $1', [backer_token])
                const donation = await db.query(`INSERT INTO donations (username, creator_username, donation_date, backer_id, sum_donation, donation_message, wallet_type, creator_id) values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`, [
                    backer.rows[0].username,
                    creator.rows[0].username,
                    date,
                    backer.rows[0].id,
                    sum,
                    donation_message,
                    wallet,
                    creator.rows[0].id
                ])

                const supporter = await db.query(`SELECT * FROM supporters WHERE backer_id = $1`, [backer.rows[0].id])
                if (donation.rows[0]) {
                    res.status(200).json({ message: 'success', donation: donation.rows[0] });
                }
                if (supporter.rows && supporter.rows.length > 0) {
                    await db.query('UPDATE supporters SET sum_donations = $1, amount_donations = $2 WHERE backer_id = $3', [
                        (parseFloat(supporter.rows[0].sum_donations) + Number(
                            parseFloat(sum) * (wallet === "tron" ? trxKoef : maticKoef))
                        ).toString(),
                        +supporter.rows[0].amount_donations + 1,
                        backer.rows[0].id,
                    ])
                } else {
                    await db.query(`INSERT INTO supporters (username, backer_id, sum_donations, creator_id, amount_donations ) values ($1, $2, $3, $4, $5) RETURNING * `, [
                        backer.rows[0].username,
                        backer.rows[0].id,
                        Number(parseFloat(sum) * (wallet === "tron" ? trxKoef : maticKoef)).toString(),
                        creator.rows[0].id,
                        1
                    ])
                }
            }
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getSupporters(req, res) {
        try {
            const user_id = req.params.user_id
            const supporters = await db.query('SELECT * FROM supporters WHERE creator_id = $1', [user_id])
            const donations = await db.query('SELECT * FROM donations WHERE creator_id = $1', [user_id])

            // const donations = await db.query(`
            //     SELECT username, SUM(sum_donation::integer) AS sum_donations
            //     FROM donations
            //     WHERE creator_id = $1
            //     GROUP BY username
            //     ORDER BY sum_donations DESC`, [user.rows[0].id])

            res.status(200).json({
                supporters: supporters.rows,
                donations: donations.rows,
            })
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getBackersInfo(req, res) {
        try {
            const sumRows = await db.query(`SELECT sum_donation, wallet_type FROM donations`)
            let sum = 0;
            const trxKoef = await getTronUsdKoef();
            const maticKoef = await getMaticUsdKoef();

            sumRows.rows.forEach((summ) =>
                sum += Number((parseFloat(summ.sum_donation) * (summ.wallet_type === "tron" ? trxKoef : maticKoef)).toFixed(2))
            )

            const allDonations = await db.query(`SELECT * FROM donations`)
            const sums = allDonations.rows.map((sum) => (parseFloat(sum.sum_donation))).sort(function (a, b) {
                return a - b;
            }).reverse().slice(0, 6)

            let donationsObj = {}

            allDonations.rows.forEach((donation, dnsIndex) => {

                if (sums.includes(parseFloat(donation.sum_donation))) {
                    if (donationsObj[donation.sum_donation] && donationsObj[donation.sum_donation].length > 0) {
                        donationsObj[donation.sum_donation].push(donation)
                    } else {
                        donationsObj[donation.sum_donation] = [donation]
                    }
                }
            })
            let donations = []
            Object.keys(donationsObj).forEach((elem) => (donations = [...donations, ...donationsObj[elem]]))

            const allSupporters = await db.query(`SELECT * FROM supporters`)
            const supportersSums = allSupporters.rows.map((sum) => (parseFloat(sum.sum_donations))).sort(function (a, b) {
                return a - b;
            }).reverse()

            const badges = await db.query(`SELECT * FROM badges`)
            const supDonations = await db.query(`SELECT * FROM donations`)
            const follows = await db.query(`SELECT * FROM follows`)

            let supporters = []
            allSupporters.rows.map(async (supporter) => {
                if (supportersSums.includes(parseFloat(supporter.sum_donations))) {
                    let bgs = []
                    badges.rows.forEach((badge) => {
                        if (badge.contributor_user_id_list.includes(supporter.backer_id)) {
                            bgs.push(badge)
                        }
                    })
                    let dns = []
                    supDonations.rows.forEach((donation) => {
                        if (donation.username === supporter.username) {
                            dns.push(donation)
                        }
                    })
                    let fls = []
                    follows.rows.forEach((follow) => {
                        if (parseInt(follow.backer_id) === supporter.backer_id) {
                            fls.push(follow)
                        }
                    })
                    supporters.push({
                        ...supporter,
                        badges: bgs,
                        donations: dns,
                        follows: fls,
                    })
                }
            })


            res.status(200).json({
                sum,
                topDonations: donations.reverse(),
                supporters: supporters
            })
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }


    async getLatestDonations(req, res) {
        try {
            const { creator_id, timePeriod } = req.params
            const data = await db.query('SELECT * FROM donations WHERE creator_id = $1', [creator_id])
            if (data && data.rows && data.rows.length > 0) {
                res.status(200).json({ donations: data.rows })
            } else {
                res.status(200).json({ donations: [] })
            }
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getTopDonations(req, res) {
        try {
            const { creator_id, timePeriod } = req.params
            const data = await db.query('SELECT * FROM donations WHERE creator_id = $1 ORDER BY sum_donation', [creator_id])
            if (data && data.rows && data.rows.length > 0) {
                res.status(200).json({ donations: data.rows })
            } else {
                res.status(200).json({ donations: [] })
            }
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }
}

module.exports = new DonationController()