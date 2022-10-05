const axios = require("axios");

const db = require("../db");

const currenciesFormatApi = {
  tEVMOS: "evmos",
  KLAY: "klay-token",
  TRX: "tron",
};

const dateParams = {
  today: "1 day",
  "7days": "7 day",
  "30days": "1 month",
  year: "1 year",
};

const dateTrancSelectParams = {
  today: "hour",
  "7days": "day",
  "30days": "day",
  year: "month",
};

const dateTrancCurrentParams = {
  yesterday: "day",
  today: "day",
  "7days": "week",
  "30days": "month",
  year: "year",
  all: "all",
  custom: "custom",
};

const getUsdKoef = async (blockchain) => {
  const blockchainForTransfer = currenciesFormatApi[blockchain];
  const { data } = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${blockchainForTransfer}&vs_currencies=usd`
  );
  return +data[blockchainForTransfer].usd;
};

const getTimePeriod = (period) => `
    to_timestamp(donation_date,'YYYY/MM/DD${
      period !== "today" ? " T HH24:MI:SS" : ""
    } ')
    >= ${
      period !== "today"
        ? `now() - interval '${dateParams[period]}'`
        : "current_date"
    } `;

const getTimeCurrentPeriod = (period, startDate = "", endDate = "") => {
  if (period === "all") return "true";
  if (period === "custom" && startDate && endDate) {
    return `to_timestamp(donation_date,'YYYY/MM/DD') 
        BETWEEN to_timestamp('${startDate}', 'DD/MM/YYYY')
        AND to_timestamp('${endDate}', 'DD/MM/YYYY')`;
  }
  return `date_trunc('${
    dateTrancCurrentParams[period]
  }', to_timestamp(donation_date, 'YYYY/MM/DD T HH24:MI:SS'))
    = date_trunc('${dateTrancCurrentParams[period]}', current_date${
    period === "yesterday" ? " - 1" : ""
  })`;
};
// date_trunc('${}', to_timestamp(donation_date, 'YYYY/MM/DD T HH24:MI:SS')) AS date_group

class DonationController {
  async createDonation(req, res) {
    try {
      const {
        creator_token,
        backer_token,
        donation_message,
        goal_id,
        sum,
        wallet,
        blockchain,
      } = req.body;

      const initDate = new Date();
      // initDate.setDate(initDate.getDate() - 4);
      const formatedDate = initDate.getTime();
      const userOffset = -initDate.getTimezoneOffset() * 60 * 1000;
      const date = new Date(formatedDate + userOffset).toISOString();
      const toUsdKoef = await getUsdKoef(blockchain); // "evmos"

      if (backer_token && creator_token) {
        const creator = await db.query(
          `SELECT * FROM users WHERE ${wallet}_token = $1`,
          [creator_token]
        );
        const backer = await db.query(
          `SELECT * FROM users WHERE ${wallet}_token = $1`,
          [backer_token]
        );
        const donation = await db.query(
          `INSERT INTO donations (donation_date, backer_id, sum_donation, donation_message, blockchain, goal_id, creator_id) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          [
            date,
            backer.rows[0].id,
            sum,
            donation_message,
            blockchain,
            goal_id,
            creator.rows[0].id,
          ]
        );

        const supporter = await db.query(
          `SELECT * FROM supporters WHERE backer_id = $1`,
          [backer.rows[0].id]
        );

        if (supporter.rows && supporter.rows.length > 0) {
          await db.query(
            "UPDATE supporters SET sum_donations = $1, amount_donations = $2 WHERE backer_id = $3",
            [
              +supporter.rows[0].sum_donations +
                Number((sum * toUsdKoef).toFixed(2)),
              +supporter.rows[0].amount_donations + 1,
              backer.rows[0].id,
            ]
          );
        } else {
          await db.query(
            `INSERT INTO supporters (backer_id, sum_donations, creator_id, amount_donations ) values ($1, $2, $3, $4) RETURNING * `,
            [
              backer.rows[0].id,
              (sum * toUsdKoef).toFixed(2),
              creator.rows[0].id,
              1,
            ]
          );
        }

        if (donation.rows[0]) {
          res
            .status(200)
            .json({ message: "success", donation: donation.rows[0] });
        }
      }
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async getSupporters(req, res) {
    try {
      const { user_id } = req.params;
      const supporters = await db.query(
        `
                SELECT users.username, users.metamask_token, users.id FROM supporters
                LEFT JOIN users
                ON supporters.backer_id = users.id
                WHERE supporters.creator_id = $1 AND users.metamask_token IS NOT NULL`,
        [user_id]
      );
      res.status(200).json(supporters.rows);
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async getLatestDonations(req, res) {
    try {
      const { user_id } = req.params;
      const { limit, timePeriod, isStatPage, startDate, endDate, blockchain } = req.query;

      const data = await db.query(
        `
                SELECT  users.username,
                        donations.id,
                        donation_message, 
                        donation_date, 
                        sum_donation 
                FROM donations 
                LEFT JOIN users
                ON backer_id = users.id 
                WHERE creator_id = $1 
                AND ${
                  isStatPage
                    ? getTimeCurrentPeriod(timePeriod, startDate, endDate)
                    : getTimePeriod(timePeriod)
                }
                ${blockchain ? ` AND blockchain = '${blockchain}'` : ""}
                ORDER BY donation_date DESC
                ${limit ? `LIMIT ${limit}` : ""}`,
        [user_id]
      );
      if (data && data.rows && data.rows.length > 0) {
        res.status(200).json(data.rows);
      } else {
        res.status(200).json([]);
      }
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async getTopDonations(req, res) {
    try {
      const { user_id } = req.params;
      const { limit, timePeriod, startDate, endDate, isStatPage, blockchain } =
        req.query;

      const data = await db.query(
        `
                SELECT  users.username,
                        donations.id,
                        donation_message,
                        blockchain,
                        donation_date, 
                        sum_donation 
                FROM donations 
                LEFT JOIN users
                ON backer_id = users.id 
                WHERE creator_id = $1
                AND ${
                  isStatPage
                    ? getTimeCurrentPeriod(timePeriod, startDate, endDate)
                    : getTimePeriod(timePeriod)
                }
                ${blockchain ? ` AND blockchain = '${blockchain}'` : ""}
                ORDER BY sum_donation DESC
                ${limit ? `LIMIT ${limit}` : ""}`,
        [user_id]
      );
      if (data.rows.length) {
        res.status(200).json(data.rows);
      } else {
        res.status(200).json([]);
      }
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async getTopSupporters(req, res) {
    try {
      const { user_id } = req.params;
      const { limit, timePeriod, isStatPage, startDate, endDate, blockchain } = req.query;

      const data = await db.query(
        `
                SELECT  users.username,
                        SUM(sum_donation::numeric) AS sum_donation 
                FROM donations 
                LEFT JOIN users
                ON backer_id = users.id 
                WHERE creator_id = $1
                AND ${
                  isStatPage
                    ? getTimeCurrentPeriod(timePeriod, startDate, endDate)
                    : getTimePeriod(timePeriod)
                }
                ${blockchain ? ` AND blockchain = '${blockchain}'` : ""}
                GROUP BY users.username
                ORDER BY sum_donation DESC 
                ${limit ? `LIMIT ${limit}` : ""}`,
        [user_id]
      );
      if (data && data.rows && data.rows.length > 0) {
        res.status(200).json(data.rows);
      } else {
        res.status(200).json([]);
      }
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async getStatsDonations(req, res) {
    try {
      const { user_id } = req.params;
      const { timePeriod, blockchain } = req.query;

      const data = await db.query(
        `
                SELECT date_trunc('${
                  dateTrancSelectParams[timePeriod]
                }', to_timestamp(donation_date, 'YYYY/MM/DD T HH24:MI:SS')) AS date_group,
                       SUM(sum_donation::numeric) AS sum_donation 
                FROM donations
                WHERE creator_id = $1 AND ${getTimePeriod(timePeriod)}
                ${blockchain ? ` AND blockchain = '${blockchain}'` : ""}
                GROUP BY date_group
                ORDER BY date_group ASC`,
        [user_id]
      );
      if (data && data.rows && data.rows.length > 0) {
        res.status(200).json(data.rows);
      } else {
        res.status(200).json([]);
      }
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async getDonationsData(req, res) {
    try {
      const { user_id } = req.params;
      const {
        roleplay,
        timePeriod,
        limit,
        offset,
        startDate,
        endDate,
        groupByName,
        searchStr,
        blockchain,
      } = req.query;

      const isGroup = groupByName === "true";
      const isCreator = roleplay === "creators";

      const data = await db.query(
        `
                SELECT users.username,
                       ${
                         isGroup
                           ? `SUM(sum_donation::numeric) AS sum_donation`
                           : `donations.id,
                    donation_message, 
                    donation_date,
                    blockchain,
                    sum_donation`
                       }
                FROM donations
                LEFT JOIN users
                ON  ${isCreator ? "backer_id" : "creator_id"} = users.id 
                WHERE ${isCreator ? "creator_id" : "backer_id"} = $1 AND
                ${
                  startDate && endDate
                    ? `to_timestamp(donation_date,'YYYY/MM/DD') 
                    BETWEEN to_timestamp('${startDate}', 'DD/MM/YYYY')
                    AND to_timestamp('${endDate}', 'DD/MM/YYYY')`
                    : `${getTimePeriod(timePeriod)}`
                }
                ${
                  searchStr
                    ? ` AND users.username LIKE '%${searchStr.toLowerCase()}%'`
                    : ""
                }
                ${blockchain ? ` AND blockchain = '${blockchain}'` : ""}
                ${
                  isGroup
                    ? `GROUP BY users.username ORDER BY sum_donation DESC`
                    : "ORDER BY donation_date DESC"
                }
                LIMIT ${limit || "ALL"}
                OFFSET ${offset || 0}`,
        [user_id]
      );

      if (data && data.rows && data.rows.length > 0) {
        res.status(200).json({ donations: data.rows, length: data.rowCount });
      } else {
        res.status(200).json({ donations: [] });
      }
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }
}

module.exports = new DonationController();
