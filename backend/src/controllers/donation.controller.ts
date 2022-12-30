import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { IFilterPeriodItems, periodItemsTypes, blockchainsType } from 'types';
import { IFullFilterPeriodItems, fullPeriodItems } from '../types.js';
import db from '../db.js';

const currenciesFormatApi: { [key in blockchainsType]: string } = {
  // tEVMOS: 'evmos',
  // KLAY: 'klay-token',
  // TRX: 'tron',
  evmos: '',
  'klay-token': '',
};

// const dateParams: IFilterPeriodItems = {
//   today: 'Today',
//   '7days': 'Last 7 days',
//   '30days': 'Last 30 days',
//   year: 'This year',
// };

const dateParams: IFilterPeriodItems = {
  today: '',
  '7days': '1 week',
  '30days': '1 month',
  year: '1 year',
};

const dateTrancSelectParams: IFilterPeriodItems = {
  today: 'hour',
  '7days': 'day',
  '30days': 'day',
  year: 'month',
};

const dateTrancCurrentParams: IFullFilterPeriodItems = {
  yesterday: 'day',
  today: 'day',
  '7days': 'week',
  '30days': 'month',
  year: 'year',
  all: 'all',
  custom: 'custom',
};

const getUsdKoef = async (blockchain: blockchainsType) => {
  const blockchainForTransfer = currenciesFormatApi[blockchain];
  const { data } = await axios.default.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${blockchainForTransfer}&vs_currencies=usd`,
  );
  return +data[blockchainForTransfer].usd;
};

const getTimePeriod = (period: periodItemsTypes) => `
    d.created_at >= ${period !== 'today' ? `now() - interval '${dateParams[period]}'` : 'current_date'} 
  `;
// to_timestamp(created_at,'YYYY/MM/DD${period !== 'today' ? ' T HH24:MI:SS' : ''} ')

const getTimeCurrentPeriod = ({
  period,
  startDate = '',
  endDate = '',
}: {
  period: fullPeriodItems;
  startDate: string;
  endDate: string;
}) => {
  if (period === 'all') return 'true';
  if (period === 'custom' && startDate && endDate) {
    return `to_timestamp(created_at,'YYYY/MM/DD') 
        BETWEEN to_timestamp('${startDate}', 'DD/MM/YYYY')
        AND to_timestamp('${endDate}', 'DD/MM/YYYY')`;
  }
  return `date_trunc('${dateTrancCurrentParams[period]}', to_timestamp(created_at, 'YYYY/MM/DD T HH24:MI:SS'))
    = date_trunc('${dateTrancCurrentParams[period]}', current_date${period === 'yesterday' ? ' - 1' : ''})`;
};
// date_trunc('${}', to_timestamp(created_at, 'YYYY/MM/DD T HH24:MI:SS')) AS date_group

class DonationController {
  async createDonation(req: Request, res: Response, next: NextFunction) {
    try {
      const { creator_token, backer_token, donation_message, goal_id, sum, wallet, blockchain } = req.body;

      // const initDate = new Date();
      // // initDate.setDate(initDate.getDate() - 4);
      // const formatedDate = initDate.getTime();
      // const userOffset = -initDate.getTimezoneOffset() * 60 * 1000;
      // const date = new Date(formatedDate + userOffset).toISOString();
      const toUsdKoef = await getUsdKoef(blockchain); // "evmos"

      if (backer_token && creator_token) {
        const creator = await db.query(`SELECT * FROM users WHERE wallet_address = $1`, [creator_token]);
        const backer = await db.query(`SELECT * FROM users WHERE wallet_address = $1`, [backer_token]);
        const donation = await db.query(
          `INSERT INTO donations (backer_id, sum_donation, donation_message, blockchain, goal_id, creator_id) values ($1, $2, $3, $4, $5, $6) RETURNING *`,
          [backer.rows[0].id, sum, donation_message, blockchain, goal_id, creator.rows[0].id],
        );

        if (donation.rows[0]) {
          res.status(200).json({ message: 'success', donation: donation.rows[0] });
        }
      }
    } catch (error) {
      next(error);
    }
  }

  async getSupporters(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params;
      const supporters = await db.query(
        `
          SELECT u.* FROM donations d
          LEFT JOIN users u
          ON d.backer_id = u.id 
          WHERE d.creator_id = $1
        `,
        [user_id],
      );
      res.status(200).json(supporters.rows);
    } catch (error) {
      next(error);
    }
  }

  async getLatestDonations(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params;
      const { limit, timePeriod, isStatPage, startDate, endDate, blockchain } = req.query;

      const data = await db.query(
        `
                SELECT  u.username,
                        d.id,
                        d.donation_message, 
                        d.created_at, 
                        d.sum_donation 
                FROM donations d
                LEFT JOIN users u
                ON d.backer_id = u.id 
                WHERE d.creator_id = $1 
                AND ${
                  isStatPage
                    ? getTimeCurrentPeriod({
                        period: timePeriod as fullPeriodItems,
                        startDate: startDate as string,
                        endDate: endDate as string,
                      })
                    : getTimePeriod(timePeriod as periodItemsTypes)
                }
                ${blockchain ? ` AND d.blockchain = '${blockchain}'` : ''}
                ORDER BY d.created_at DESC
                ${limit ? `LIMIT ${limit}` : ''}`,
        [user_id],
      );
      if (data && data.rows && data.rows.length > 0) {
        res.status(200).json(data.rows);
      } else {
        res.status(200).json([]);
      }
    } catch (error) {
      next(error);
    }
  }

  async getTopDonations(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params;
      const { limit, timePeriod, startDate, endDate, isStatPage, blockchain } = req.query;

      const data = await db.query(
        `
          SELECT  u.username,
                  d.id,
                  d.donation_message,
                  d.blockchain,
                  d.created_at, 
                  sum_donation 
          FROM donations d
          LEFT JOIN users u
          ON d.backer_id = u.id 
          WHERE d.creator_id = $1
          AND ${
            isStatPage
              ? getTimeCurrentPeriod({
                  period: timePeriod as fullPeriodItems,
                  startDate: startDate as string,
                  endDate: endDate as string,
                })
              : getTimePeriod(timePeriod as periodItemsTypes)
          }
          ${blockchain ? ` AND d.blockchain = '${blockchain}'` : ''}
          ORDER BY sum_donation DESC
          ${limit ? `LIMIT ${limit}` : ''}`,
        [user_id],
      );
      if (data.rows.length) {
        res.status(200).json(data.rows);
      } else {
        res.status(200).json([]);
      }
    } catch (error) {
      next(error);
    }
  }

  async getTopSupporters(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params;
      const { limit, timePeriod, isStatPage, startDate, endDate, blockchain } = req.query;

      const data = await db.query(
        `
          SELECT  u.username,
                  SUM(sum_donation::numeric) AS sum_donation 
          FROM donations d
          LEFT JOIN users u
          ON d.backer_id = u.id 
          WHERE d.creator_id = $1
          AND ${
            isStatPage
              ? getTimeCurrentPeriod({
                  period: timePeriod as fullPeriodItems,
                  startDate: startDate as string,
                  endDate: endDate as string,
                })
              : getTimePeriod(timePeriod as periodItemsTypes)
          }
          ${blockchain ? ` AND d.blockchain = '${blockchain}'` : ''}
          GROUP BY u.username
          ORDER BY sum_donation DESC 
          ${limit ? `LIMIT ${limit}` : ''}`,
        [user_id],
      );

      if (data.rowCount) return res.status(200).json(data.rows);
      else return res.status(200).json([]);
    } catch (error) {
      next(error);
    }
  }

  async getStatsDonations(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params;
      const { timePeriod, blockchain } = req.query;

      const data = await db.query(
        `
            SELECT date_trunc('${dateTrancSelectParams[timePeriod as periodItemsTypes]}', created_at) AS date_group,
                    SUM(sum_donation::numeric) AS sum_donation 
            FROM donations d
            WHERE d.creator_id = $1 AND ${getTimePeriod(timePeriod as periodItemsTypes)}
            ${blockchain ? ` AND d.blockchain = '${blockchain}'` : ''}
            GROUP BY date_group
            ORDER BY date_group ASC`,
        [user_id],
      );
      if (data.rowCount) return res.status(200).json(data.rows);
      else return res.status(200).json([]);
    } catch (error) {
      next(error);
    }
  }

  async getDonationsData(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params;
      const { roleplay, timePeriod, limit, offset, startDate, endDate, groupByName, searchStr, blockchain } = req.query;

      const isGroup = groupByName === 'true';
      const isCreator = roleplay === 'creators';

      const data = await db.query(
        `
                SELECT u.username,
                       ${
                         isGroup
                           ? `SUM(d.sum_donation::numeric) AS sum_donation`
                           : `d.id,
                    d.donation_message, 
                    d.created_at,
                    d.blockchain,
                    d.sum_donation`
                       }
                FROM donations d
                LEFT JOIN users u
                ON  ${isCreator ? 'd.backer_id' : 'd.creator_id'} = u.id 
                WHERE ${isCreator ? 'd.creator_id' : 'd.backer_id'} = $1 AND
                ${
                  startDate && endDate
                    ? `to_timestamp(d.created_at,'YYYY/MM/DD') 
                    BETWEEN to_timestamp('${startDate}', 'DD/MM/YYYY')
                    AND to_timestamp('${endDate}', 'DD/MM/YYYY')`
                    : `${getTimePeriod(timePeriod as periodItemsTypes)}`
                }
                ${searchStr ? ` AND u.username LIKE '%${(searchStr as string).toLowerCase()}%'` : ''}
                ${blockchain ? ` AND d.blockchain = '${blockchain}'` : ''}
                ${isGroup ? `GROUP BY u.username ORDER BY d.sum_donation DESC` : 'ORDER BY d.created_at DESC'}
                LIMIT ${limit || 'ALL'}
                OFFSET ${offset || 0}`,
        [user_id],
      );

      if (data && data.rows && data.rows.length > 0) {
        res.status(200).json({ donations: data.rows, length: data.rowCount });
      } else {
        res.status(200).json({ donations: [] });
      }
    } catch (error) {
      next(error);
    }
  }
}

export default DonationController;
