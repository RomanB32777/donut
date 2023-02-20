import { NextFunction, Request, Response } from 'express';
import { IFilterPeriodItems, periodItemsTypes, IFullSendDonat, IDonationsQueryData, allPeriodItemsTypes } from 'types';
import { clean } from '../modules/badWords/index.js';
import db from '../db.js';
import { getUsdKoef, getUsername, parseBool } from '../utils.js';
import { exchangeNames } from '../consts.js';
import {
  IFullFilterPeriodItems,
  RequestParams,
  ResponseBody,
  RequestBody,
  RequestQuery,
  HttpCode,
  RequestUserIDParam,
} from '../types.js';

const dateTrancSelectParams: IFilterPeriodItems = {
  today: 'hour',
  '7days': 'day',
  '30days': 'day',
  year: 'month',
};

const dateTrancCurrentParams: IFullFilterPeriodItems = {
  yesterday: '1 day',
  today: '',
  '7days': '1 week',
  '30days': '1 month',
  year: '1 year',
  custom: '',
  all: 'all',
};

const getTimePeriod = ({
  timePeriod,
  startDate,
  endDate,
}: {
  timePeriod?: allPeriodItemsTypes;
  startDate?: string;
  endDate?: string;
}) => {
  if (timePeriod) {
    if (timePeriod === 'all') return 'true';
    if (startDate && endDate)
      return `to_timestamp(d.created_at::text,'YYYY/MM/DD') 
          BETWEEN to_timestamp('${startDate}', 'DD/MM/YYYY')
          AND to_timestamp('${endDate}', 'DD/MM/YYYY')`;

    return `d.created_at >= ${
      timePeriod !== 'today' ? `now() - interval '${dateTrancCurrentParams[timePeriod]}'` : 'current_date'
    } `;
  }

  return 'true';
};

const getSumInUsd = (usdKoefs: any) =>
  `CASE d.blockchain ${Object.keys(exchangeNames)
    .map((c) => `WHEN '${c}' THEN ${usdKoefs[c]}`)
    .join(' ')}
        ELSE 1
        END`;

class DonationController {
  async createDonation(
    req: Request<RequestParams, ResponseBody, IFullSendDonat, RequestQuery>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { creator, backer, message, selectedBlockchain, amount, selectedGoal, is_anonymous } = req.body;
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

        if (donation.rows[0]) return res.status(HttpCode.CREATED).json(donation.rows[0]);
        return res.sendStatus(HttpCode.NOT_FOUND);
      }
      return res.sendStatus(HttpCode.BAD_REQUEST);
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
      return res.status(HttpCode.OK).json(supporters.rows);
    } catch (error) {
      next(error);
    }
  }

  async getLatestDonations(
    req: Request<RequestUserIDParam, ResponseBody, RequestBody, IDonationsQueryData>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { user_id } = req.params;
      const { limit, timePeriod, startDate, endDate, spam_filter } = req.query;

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
          AND ${getTimePeriod({ timePeriod, startDate, endDate })}
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
        return res.status(HttpCode.OK).json(donations);
      }
      return res.status(HttpCode.OK).json([]);
    } catch (error) {
      next(error);
    }
  }

  async getTopDonations(
    req: Request<RequestUserIDParam, ResponseBody, RequestBody, IDonationsQueryData>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { user_id } = req.params;
      const { limit, timePeriod, startDate, endDate, spam_filter } = req.query;

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
          AND ${getTimePeriod({ timePeriod, startDate, endDate })}
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
        return res.status(HttpCode.OK).json(donations);
      }
      return res.status(HttpCode.OK).json([]);
    } catch (error) {
      next(error);
    }
  }

  async getTopSupporters(
    req: Request<RequestUserIDParam, ResponseBody, RequestBody, IDonationsQueryData>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { user_id } = req.params;
      const { limit, timePeriod, startDate, endDate } = req.query;

      const usdKoefs = await getUsdKoef();

      const joinBlock = `
        FROM donations d
          LEFT JOIN users u
          ON d.backer_id = u.id
        `;

      const whereBlock = `d.creator_id = $1 AND ${getTimePeriod({ timePeriod, startDate, endDate })}`;

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
      return res.status(HttpCode.OK).json(data.rows);
    } catch (error) {
      next(error);
    }
  }

  async getStatsDonations(
    req: Request<RequestUserIDParam, ResponseBody, RequestBody, IDonationsQueryData>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { user_id } = req.params;
      const { timePeriod } = req.query;

      const usdKoefs = await getUsdKoef();

      const data = await db.query(
        `
            SELECT date_trunc('${dateTrancSelectParams[timePeriod as periodItemsTypes]}', created_at) AS date_group,
              COALESCE(SUM(sum_donation * ${getSumInUsd(usdKoefs)}), 0)::numeric AS sum_donation 
            FROM donations d
            WHERE d.creator_id = $1 AND ${getTimePeriod({ timePeriod })}
            GROUP BY date_group
            ORDER BY date_group ASC`,
        [user_id],
      );
      return res.status(HttpCode.OK).json(data.rows);
    } catch (error) {
      next(error);
    }
  }

  async getDonationsData(
    req: Request<RequestUserIDParam, ResponseBody, RequestBody, IDonationsQueryData>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { user_id } = req.params;
      const { roleplay, timePeriod, limit, offset, startDate, endDate, groupByName, searchStr, spam_filter } =
        req.query;

      const isGroup = parseBool(groupByName);
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
              ${getTimePeriod({ timePeriod, startDate, endDate })}
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
          return res.status(HttpCode.OK).json(donations);
        }
      } else if (isGroup) {
        const joinBlock = `
          FROM donations d
            LEFT JOIN users u
            ON  ${isCreator ? 'd.backer_id' : 'd.creator_id'} = u.id 
          `;

        const whereBlock = `${isCreator ? 'd.creator_id' : 'd.backer_id'} = $1 AND
          ${getTimePeriod({ timePeriod, startDate, endDate })}`;

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
        return res.status(HttpCode.OK).json(data.rows);
      }
      return res.status(HttpCode.OK).json([]);
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

      if (usdKoefs) return res.status(HttpCode.OK).json(usdKoefs);
      return res.status(HttpCode.NOT_FOUND);
    } catch (error) {
      next(error);
    }
  }
}

export default DonationController;
