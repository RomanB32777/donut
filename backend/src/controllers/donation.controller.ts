import { NextFunction, Request, Response } from 'express';
import { IFilterPeriodItems, periodItemsTypes, IFullSendDonat } from 'types';
import { clean } from '../modules/badWords/index.js';
import db from '../db.js';
import { getUsdKoef, getUsername, parseBool } from '../utils.js';
import { exchangeNames } from '../consts.js';
import { IFullFilterPeriodItems, fullPeriodItems, RequestParams, ResponseBody, RequestBody } from '../types.js';

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

const getTimePeriod = (period: periodItemsTypes) => `
    d.created_at >= ${period !== 'today' ? `now() - interval '${dateParams[period]}'` : 'current_date'} 
  `;

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
    return `to_timestamp(d.created_at::text,'YYYY/MM/DD') 
        BETWEEN to_timestamp('${startDate}', 'DD/MM/YYYY')
        AND to_timestamp('${endDate}', 'DD/MM/YYYY')`;
  }
  return `date_trunc('${dateTrancCurrentParams[period]}', to_timestamp(d.created_at::text, 'YYYY/MM/DD T HH24:MI:SS'))
    = date_trunc('${dateTrancCurrentParams[period]}', current_date${period === 'yesterday' ? ' - 1' : ''})`;
};

const getSumInUsd = (usdKoefs: any) =>
  `CASE d.blockchain ${Object.keys(exchangeNames)
    .map((c) => `WHEN '${c}' THEN ${usdKoefs[c]}`)
    .join(' ')}
        ELSE 1
        END`;

class DonationController {
  async createDonation(req: Request, res: Response, next: NextFunction) {
    try {
      const { creator, backer, message, selectedBlockchain, amount, selectedGoal, is_anonymous } =
        req.body as IFullSendDonat;
      if (creator && backer) {
        const donation = await db.query(
          `INSERT INTO donations (backer_id, sum_donation, donation_message, blockchain, goal_id, is_anonymous, creator_id) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          [
            backer,
            amount,
            message,
            selectedBlockchain,
            parseBool(selectedGoal) ? selectedGoal : null,
            is_anonymous,
            creator,
          ],
        );

        if (donation.rows[0]) return res.status(200).json(donation.rows[0]);
        return res.status(204).json({});
      }
      return res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }

  async getSupporters(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params;
      const supporters = await db.query(
        `
          SELECT u.*
          FROM (
              SELECT u.username
              FROM donations d
              JOIN users u
              ON d.backer_id = u.id 
              WHERE d.creator_id = $1 AND d.is_anonymous != True 
              GROUP BY u.username
          ) us
          JOIN users u ON u.username = us.username
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
      const { limit, timePeriod, isStatPage, startDate, endDate, spam_filter } = req.query;

      const usdKoefs = await getUsdKoef();

      const data = await db.query(
        `
          SELECT  ${getUsername()}
                  d.id,
                  d.donation_message, 
                  d.created_at, 
                  d.sum_donation * ${getSumInUsd(usdKoefs)} as sum_donation
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
          ORDER BY d.created_at DESC
          ${limit ? `LIMIT ${limit}` : ''}`,
        [user_id],
      );
      if (data.rowCount) {
        const donations = parseBool(spam_filter)
          ? data.rows.map((d) => ({
              ...d,
              donation_message: d.donation_message ? clean(d.donation_message) : '-',
            }))
          : data.rows;
        return res.status(200).json(donations);
      }
      return res.status(200).json([]);
    } catch (error) {
      next(error);
    }
  }

  async getTopDonations(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params;
      const { limit, timePeriod, startDate, endDate, isStatPage, spam_filter } = req.query;

      const data = await db.query(
        `
          SELECT  ${getUsername()}
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
          ORDER BY sum_donation DESC
          ${limit ? `LIMIT ${limit}` : ''}`,
        [user_id],
      );

      if (data.rowCount) {
        const donations = parseBool(spam_filter)
          ? data.rows.map((d) => ({
              ...d,
              donation_message: d.donation_message ? clean(d.donation_message) : '-',
            }))
          : data.rows;
        return res.status(200).json(donations);
      }
      return res.status(200).json([]);
    } catch (error) {
      next(error);
    }
  }

  async getTopSupporters(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params;
      const { limit, timePeriod, isStatPage, startDate, endDate } = req.query;

      const usdKoefs = await getUsdKoef();

      const joinBlock = `
        FROM donations d
          LEFT JOIN users u
          ON d.backer_id = u.id
        `;

      const whereBlock = `d.creator_id = $1 AND ${
        isStatPage
          ? getTimeCurrentPeriod({
              period: timePeriod as fullPeriodItems,
              startDate: startDate as string,
              endDate: endDate as string,
            })
          : getTimePeriod(timePeriod as periodItemsTypes)
      }`;

      const data = await db.query(
        `
        SELECT * FROM (
            SELECT 'anonymous' as username,
                COALESCE(SUM(sum_donation * ${getSumInUsd(usdKoefs)}), 0)::numeric AS sum_donation 
              ${joinBlock}
              WHERE	d.is_anonymous = 'true'
              AND ${whereBlock}
          UNION
            SELECT u.username, 
                COALESCE(SUM(sum_donation * ${getSumInUsd(usdKoefs)}), 0)::numeric AS sum_donation 
              ${joinBlock}
              WHERE	d.is_anonymous = 'false'
              AND ${whereBlock}
              GROUP BY u.username
              ORDER BY sum_donation DESC 
              ${limit ? `LIMIT ${limit}` : ''}
          ) as result
          WHERE result.sum_donation > 0`,
        [user_id],
      );

      if (data.rowCount) return res.status(200).json(data.rows);
      return res.status(200).json([]);
    } catch (error) {
      next(error);
    }
  }

  async getStatsDonations(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params;
      const { timePeriod } = req.query;

      const usdKoefs = await getUsdKoef();

      const data = await db.query(
        `
            SELECT date_trunc('${dateTrancSelectParams[timePeriod as periodItemsTypes]}', created_at) AS date_group,
              COALESCE(SUM(sum_donation * ${getSumInUsd(usdKoefs)}), 0)::numeric AS sum_donation 
            FROM donations d
            WHERE d.creator_id = $1 AND ${getTimePeriod(timePeriod as periodItemsTypes)}
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
      const { roleplay, timePeriod, limit, offset, startDate, endDate, groupByName, searchStr, spam_filter } =
        req.query;

      const isGroup = groupByName === 'true';
      const isCreator = roleplay === 'creators';

      const usdKoefs = await getUsdKoef();

      if (!isGroup) {
        const data = await db.query(
          `${searchStr ? 'SELECT * FROM (' : ''}
              SELECT ${isCreator ? getUsername() : 'u.username,'}
                  d.id,
                  d.donation_message, 
                  d.created_at,
                  d.blockchain,
                  d.sum_donation,
                  d.sum_donation * ${getSumInUsd(usdKoefs)} as sum_usd_donation
              FROM donations d
              LEFT JOIN users u
              ON  ${isCreator ? 'd.backer_id' : 'd.creator_id'} = u.id 
              WHERE ${isCreator ? 'd.creator_id' : 'd.backer_id'} = $1 AND
              ${
                startDate && endDate
                  ? `to_timestamp(d.created_at::text,'YYYY/MM/DD') 
                  BETWEEN to_timestamp('${startDate}', 'DD/MM/YYYY')
                  AND to_timestamp('${endDate}', 'DD/MM/YYYY')`
                  : `${getTimePeriod(timePeriod as periodItemsTypes)}`
              }
              ORDER BY d.created_at DESC
              LIMIT ${limit || 'ALL'}
              OFFSET ${offset || 0}
          ${searchStr ? `) as result WHERE username LIKE '%${(searchStr as string).toLowerCase()}%'` : ''}`,
          [user_id],
        );

        if (data.rowCount) {
          const donations = parseBool(spam_filter)
            ? data.rows.map((d) => ({
                ...d,
                donation_message: d.donation_message ? clean(d.donation_message) : '-',
              }))
            : data.rows;
          return res.status(200).json(donations);
        }
      } else if (isGroup) {
        const joinBlock = `
          FROM donations d
            LEFT JOIN users u
            ON  ${isCreator ? 'd.backer_id' : 'd.creator_id'} = u.id 
          `;

        const whereBlock = `${isCreator ? 'd.creator_id' : 'd.backer_id'} = $1 AND
          ${
            startDate && endDate
              ? `to_timestamp(d.created_at::text,'YYYY/MM/DD') 
              BETWEEN to_timestamp('${startDate}', 'DD/MM/YYYY')
              AND to_timestamp('${endDate}', 'DD/MM/YYYY')`
              : `${getTimePeriod(timePeriod as periodItemsTypes)}`
          }`;

        const data = await db.query(
          `
          SELECT * FROM (
              SELECT 'anonymous' as username,
                  COALESCE(SUM(sum_donation * ${getSumInUsd(usdKoefs)}), 0)::numeric AS sum_usd_donation
                ${joinBlock}
                WHERE	d.is_anonymous = 'true'
                AND ${whereBlock}
            UNION
              SELECT u.username,
                  COALESCE(SUM(sum_donation * ${getSumInUsd(usdKoefs)}), 0)::numeric AS sum_usd_donation
                ${joinBlock}
                WHERE	d.is_anonymous = 'false'
                AND ${whereBlock}
                GROUP BY u.username
                ORDER BY sum_usd_donation DESC
                LIMIT ${limit || 'ALL'}
                OFFSET ${offset || 0}
            ) as result
            WHERE result.sum_usd_donation > 0 ${
              searchStr ? `AND username LIKE '%${(searchStr as string).toLowerCase()}%'` : ''
            }`,
          [user_id],
        );
        return res.status(200).json(data.rows);
      }

      return res.status(200).json([]);
    } catch (error) {
      next(error);
    }
  }

  async getUsdKoef(
    req: Request<RequestParams, ResponseBody, RequestBody, { blockchain?: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { blockchain } = req.query;
      const usdKoefs = await getUsdKoef(blockchain);

      if (usdKoefs) return res.status(200).json(usdKoefs);

      return res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
}

export default DonationController;
