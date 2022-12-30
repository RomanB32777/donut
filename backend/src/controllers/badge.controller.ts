import { NextFunction, Request, Response } from 'express';
import db from '../db.js';
import { IBadgeInfo } from 'types';

class BadgeController {
  async createBadge(req: Request, res: Response, next: NextFunction) {
    try {
      const { creator_id, contract_address, blockchain, transaction_hash, result } = req.body as IBadgeInfo;
      const creator = await db.query('SELECT * FROM users WHERE id = $1', [creator_id]);
      if (creator) {
        const transaction_status = !result && Boolean(transaction_hash) ? 'pending' : result; //"success";

        const newBadge = await db.query(
          `INSERT INTO badges (creator_id, contract_address, blockchain, transaction_hash, transaction_status) values ($1, $2, $3, $4, $5) RETURNING id`,
          [creator.rows[0].id, contract_address, blockchain, transaction_hash, transaction_status],
        );
        res.status(200).json(newBadge.rows[0]);
      }
    } catch (error) {
      next(error);
    }
  }

  async getBadges(req: Request, res: Response, next: NextFunction) {
    try {
      const { creator_id } = req.params;
      const { blockchain, status } = req.query;
      const badges = await db.query(
        `
            SELECT * FROM badges
            WHERE creator_id = $1
            ${blockchain ? ` AND blockchain = '${blockchain}'` : ''}
            ${status ? ` AND transaction_status = '${status}'` : ''}
            `,
        [creator_id],
      );
      res.status(200).json(badges.rows);
    } catch (error) {
      next(error);
    }
  }

  async getBadge(req: Request, res: Response, next: NextFunction) {
    try {
      const { badge_id, contract_address } = req.params;
      const badges = await db.query(`SELECT * FROM badges WHERE id = $1 AND contract_address= $2`, [
        badge_id,
        contract_address,
      ]);
      res.status(200).json(badges.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async deleteBadge(req: Request, res: Response, next: NextFunction) {
    try {
      const { badge_id, contract_address } = req.params;
      const deletedBadge = await db.query(`DELETE FROM badges WHERE id = $1 AND contract_address= $2 RETURNING *;`, [
        badge_id,
        contract_address,
      ]);
      res.status(200).json(deletedBadge.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async assignBadge(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, contract_address, contributor_id } = req.body;
      const existingBadge = await db.query(
        'SELECT contributor_user_id_list FROM badges WHERE id = $1 AND contract_address= $2',
        [id, contract_address],
      );
      const contributor_user_id_list = existingBadge.rows[0].contributor_user_id_list;
      const assignedBadge = await db.query(
        'UPDATE badges SET contributor_user_id_list = $1 WHERE id = $2 AND contract_address = $3 RETURNING *',
        [contributor_user_id_list + contributor_id + ' ', id, contract_address],
      );
      res.status(200).json(assignedBadge.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async getBadgesHolders(req: Request, res: Response, next: NextFunction) {
    try {
      const { badge_id, contract_address } = req.params;
      const users = await db.query(
        `SELECT contributor_user_id_list FROM badges WHERE id = $1 AND contract_address= $2`,
        [badge_id, contract_address],
      );
      if (users.rows && users.rows[0].contributor_user_id_list.length) {
        const usersIDs = users.rows[0].contributor_user_id_list.split(' ').filter(Boolean).join(',');
        const holders = await db.query(`
                    SELECT backers.id, backers.avatar, users.username
                    FROM backers
                    LEFT JOIN users
                    ON backers.user_id = users.id
                    WHERE backers.user_id IN (${usersIDs})
                `);
        return res.status(200).json(holders.rows);
      }
      res.status(200).json([]);
    } catch (error) {
      next(error);
    }
  }

  async getBadgesByBacker(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params;
      const { blockchain, status } = req.query;
      const badges = await db.query(
        `SELECT * FROM badges
        WHERE contributor_user_id_list LIKE '%${user_id}%'
        ${blockchain ? ` AND blockchain = '${blockchain}'` : ''}
        ${status ? ` AND transaction_status = '${status}'` : ''}
        `,
      );
      res.status(200).json(badges.rows);
    } catch (error) {
      next(error);
    }
  }

  async getBadgesByCreator(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.params.user_id;

      const badges = await db.query('SELECT * FROM badges WHERE owner_user_id = $1', [parseInt(user_id)]);
      res.status(200).json({ badges: badges.rows });
    } catch (error) {
      next(error);
    }
  }
}

export default BadgeController;
