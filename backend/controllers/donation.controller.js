const axios = require("axios");

const db = require('../db')

const getTronUsdKoef = async () => {
    const res = await axios.get(
        "https://www.binance.com/api/v3/ticker/price?symbol=TRXUSDT"
    );
    return +res.data.price;
};

const getMaticUsdKoef = async () => {
    const { res } = await axios.get(
        "https://www.binance.com/api/v3/ticker/price?symbol=MATICUSDT"
    );
    return +res.data.price;
};

const getUsdKoef = async (currency) => {
    const { data } = await axiosClient.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${currency}&vs_currencies=usd`
    );
    return +data[currency].usd
};

const dateParams = {
    'today': '1 day',
    '7days': '7 day',
    '30days': '1 month',
    'year': '1 year',
}

const dateTrancSelectParams = {
    'today': 'hour',
    '7days': 'week',
    '30days': 'day',
    'year': 'month',
}

const dateTrancCurrentParams = {
    'yesterday': 'day',
    'today': 'day',
    '7days': 'week',
    '30days': 'month',
    'year': 'year',
}

const getTimePeriod = (period) => `
    to_timestamp(donation_date,'YYYY/MM/DD${period !== 'today' ? ' T HH24:MI:SS' : ''} ')
    >= ${period !== 'today' ? `now() - interval '${dateParams[period]}'` : 'current_date'} `

const getTimeCurrentPeriod = (period) => `date_trunc('${dateTrancCurrentParams[period]}', to_timestamp(donation_date, 'YYYY/MM/DD T HH24:MI:SS'))
    = date_trunc('${dateTrancCurrentParams[period]}', current_date${period === "yesterday" ? " - 1" : ""})`

// date_trunc('${}', to_timestamp(donation_date, 'YYYY/MM/DD T HH24:MI:SS')) AS date_group

class DonationController {
    async createDonation(req, res) {
        try {
            const { creator_token, backer_token, donation_message, goal_id, sum, wallet } = req.body

            const initDate = new Date()
            // initDate.setDate(initDate.getDate() - 4);
            const formatedDate = initDate.getTime()
            const userOffset = -initDate.getTimezoneOffset() * 60 * 1000
            const date = new Date(formatedDate + userOffset).toISOString()

            const trxKoef = await getTronUsdKoef();
            const maticKoef = await getUsdKoef();

            if (backer_token && creator_token) {
                const creator = await db.query('SELECT * FROM users WHERE tron_token = $1 OR metamask_token = $1', [creator_token])
                const backer = await db.query('SELECT * FROM users WHERE tron_token = $1 OR metamask_token = $1', [backer_token])
                const donation = await db.query(`INSERT INTO donations (username, creator_username, donation_date, backer_id, sum_donation, donation_message, wallet_type, goal_id, creator_id) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, [
                    backer.rows[0].username,
                    creator.rows[0].username,
                    date,
                    backer.rows[0].id,
                    sum,
                    donation_message,
                    wallet,
                    goal_id,
                    creator.rows[0].id
                ])

                const supporter = await db.query(`SELECT * FROM supporters WHERE backer_id = $1`, [backer.rows[0].id])
                if (donation.rows[0]) {
                    res.status(200).json({ message: 'success', donation: donation.rows[0] });
                }

                if (supporter.rows && supporter.rows.length > 0) {
                    await db.query('UPDATE supporters SET sum_donations = $1, amount_donations = $2 WHERE backer_id = $3', [
                        +supporter.rows[0].sum_donations + Number((sum * maticKoef).toFixed(2)),
                        +supporter.rows[0].amount_donations + 1,
                        backer.rows[0].id,
                    ])
                } else {
                    await db.query(`INSERT INTO supporters (username, backer_id, sum_donations, creator_id, amount_donations ) values ($1, $2, $3, $4, $5) RETURNING * `, [
                        backer.rows[0].username,
                        backer.rows[0].id,
                        (sum * (wallet === "tron" ? trxKoef : maticKoef)).toFixed(2),
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
            const { user_id } = req.params
            const supporters = await db.query(`
                SELECT users.username, users.metamask_token, users.id FROM supporters
                LEFT JOIN users
                ON supporters.backer_id = users.id
                WHERE supporters.creator_id = $1 AND users.metamask_token IS NOT NULL`, [user_id])
            // const donations = await db.query('SELECT * FROM donations WHERE creator_id = $1', [user_id])
            res.status(200).json(supporters.rows)
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getBackersInfo(req, res) {
        try {
            const sumRows = await db.query(`SELECT sum_donation, wallet_type FROM donations`)
            let sum = 0;
            const trxKoef = await getTronUsdKoef();
            const maticKoef = await getUsdKoef();

            sumRows.rows.forEach((summ) =>
                sum += summ.sum_donation * (summ.wallet_type === "tron" ? trxKoef : maticKoef)
            )

            const allDonations = await db.query(`SELECT * FROM donations`)
            const sums = allDonations.rows.map((sum) => sum.sum_donation).sort(function (a, b) {
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
            const supportersSums = allSupporters.rows.map((sum) => sum.sum_donations).sort(function (a, b) {
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
            const { user_id } = req.params;
            const { limit, timePeriod } = req.query;

            const data = await db.query(`
                SELECT * FROM donations
                WHERE creator_id = $1 
                AND ${getTimePeriod(timePeriod)} 
                ORDER BY donation_date DESC
                ${limit ? `LIMIT ${limit}` : ''}`, [user_id])
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
            const { user_id } = req.params; // timePeriod
            const { limit, timePeriod, isStat } = req.query;

            const data = await db.query(`
                SELECT * FROM donations 
                WHERE creator_id = $1 
                AND ${isStat ? getTimeCurrentPeriod(timePeriod) : getTimePeriod(timePeriod)} 
                ORDER BY sum_donation DESC
                ${limit ? `LIMIT ${limit}` : ''}`, [user_id])
            if (data && data.rows && data.rows.length > 0) {
                res.status(200).json({ donations: data.rows })
            } else {
                res.status(200).json({ donations: [] })
            }
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getTopSupporters(req, res) {
        try {
            const { user_id } = req.params;
            const { limit } = req.query; // timePeriod

            const data = await db.query(`
                SELECT id, username, sum_donations 
                FROM supporters 
                WHERE creator_id = $1
                ORDER BY sum_donations DESC 
                ${limit ? `LIMIT ${limit}` : ''}`, [user_id]);
            // AND to_timestamp(donation_date, 'YYYY/MM/DD T HH24:MI:SS') >= now() - interval '${dateParams[timePeriod]}'
            if (data && data.rows && data.rows.length > 0) {
                res.status(200).json({ supporters: data.rows })
            } else {
                res.status(200).json({ supporters: [] })
            }
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getStatsDonations(req, res) {
        try {
            const { user_id } = req.params;
            const { timePeriod } = req.query;

            const data = await db.query(`
                SELECT date_trunc('${dateTrancSelectParams[timePeriod]}', to_timestamp(donation_date, 'YYYY/MM/DD T HH24:MI:SS')) AS date_group,
                       SUM(sum_donation::numeric) AS sum_donation 
                FROM donations
                WHERE creator_id = $1 AND ${getTimePeriod(timePeriod)}
                GROUP BY date_group
                ORDER BY date_group ASC`, [user_id])
            if (data && data.rows && data.rows.length > 0) {
                res.status(200).json({ donations: data.rows })
            } else {
                res.status(200).json({ donations: [] })
            }
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }


    async getDonationsData(req, res) {
        try {
            const { user_id } = req.params;
            const { roleplay, timePeriod, limit, offset, startDate, endDate, groupByName, searchStr } = req.query;

            const isGroup = groupByName === "true";
            const isCreator = roleplay === "creators";

            // sum_donation, wallet_type, donation_message
            const data = await db.query(`
                SELECT ${isGroup ? `username,
                SUM(sum_donation::numeric) AS sum_donation` : "*"}
                FROM donations 
                WHERE ${isCreator ? "creator_id" : "backer_id"} = $1 AND
                ${startDate && endDate ?
                    `to_timestamp(donation_date,'YYYY/MM/DD') 
                    BETWEEN to_timestamp('${startDate}', 'DD/MM/YYYY')
                    AND to_timestamp('${endDate}', 'DD/MM/YYYY')`
                    :
                    `${getTimePeriod(timePeriod)}`
                }
                ${searchStr ?
                    `AND username LIKE '%${searchStr.toLowerCase()}%'`
                    : ""
                }
                ${isGroup ? `GROUP BY ${isCreator ? "username" : "creator_username"}` : "ORDER BY donation_date DESC"}
                LIMIT ${limit}
                OFFSET ${offset}`, [user_id])

            if (data && data.rows && data.rows.length > 0) {
                res.status(200).json({ donations: data.rows, length: data.rowCount })
            } else {
                res.status(200).json({ donations: [] })
            }
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

}

module.exports = new DonationController()