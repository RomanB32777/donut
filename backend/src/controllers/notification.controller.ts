import e, { NextFunction, Request, Response } from 'express';
import { INotificationQueries } from 'types/index.js';
import db from '../db.js';
import badWordsFilter from '../modules/badWords/index.js';
import { getUsername, parseBool } from '../utils.js';

class NotificationController {
  async getUserNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req.params;
      const { limit, offset, sort, sortDirection, spam_filter, roleplay } = req.query as INotificationQueries;

      let userId = user;

      // if user - not id
      if (user.includes('@')) {
        const userInfo = await db.query(`SELECT id FROM users WHERE username = $1`, [user]);
        if (userInfo.rows[0]) userId = userInfo.rows[0].id;
      }

      const getRecipientNotifications = async () => {
        const recipientNotifications = await db.query(
          `WITH un AS (
                SELECT un.*, u.username FROM users_notifications un
                LEFT JOIN users u ON u.id = un.user_id
              ), d AS (
                SELECT ${getUsername()} 
                  d.*
                FROM donations d
                LEFT JOIN users u ON d.backer_id = u.id 
                WHERE d.creator_id = $1
              )
              SELECT n.id, n.created_at, 
                d.username as sender, un.roleplay, un.read,
                to_jsonb(d) as donation, to_jsonb(b) as badge 
              FROM notifications n

              LEFT JOIN un
              ON un.notification_id = n.id
                
              LEFT JOIN d
              ON d.id = n.donation
                
              LEFT JOIN badges b
              ON b.id = n.badge
                
              WHERE un.user_id = $1 AND un.roleplay = 'recipient'

              ORDER BY ${sort || 'created_at'} ${sortDirection || 'DESC'}
              ${limit ? `LIMIT ${limit}` : ''}
              ${offset ? `OFFSET ${offset}` : ''}`,
          [userId],
        );
        if (recipientNotifications.rowCount)
          return parseBool(spam_filter)
            ? recipientNotifications.rows.map((notification) => {
                const { donation } = notification;
                if (donation)
                  return {
                    ...notification,
                    donation: {
                      ...donation,
                      donation_message: donation.donation_message
                        ? badWordsFilter.clean(donation.donation_message)
                        : '-',
                    },
                  };
                return notification;
              })
            : recipientNotifications.rows;
        return [];
      };

      const getSenderNotifications = async () => {
        const senderNotifications = await db.query(
          `WITH un AS (
            SELECT un.*, u.username FROM users_notifications un
            LEFT JOIN users u ON u.id = un.user_id
          ), d AS (
            SELECT d.*, u.username AS username 
            FROM donations d
            LEFT JOIN users u ON d.creator_id = u.id 
            WHERE d.backer_id = $1
          )
          SELECT n.id, n.created_at, 
            d.username as recipient, un.roleplay, un.read,
            to_jsonb(d) as donation, to_jsonb(b) as badge 
          FROM notifications n

          LEFT JOIN un
          ON un.notification_id = n.id
            
          LEFT JOIN d
          ON d.id = n.donation
            
          LEFT JOIN badges b
          ON b.id = n.badge
            
          WHERE un.user_id = $1 AND un.roleplay = 'sender'

          ORDER BY ${sort || 'created_at'} ${sortDirection || 'DESC'}
          ${limit ? `LIMIT ${limit}` : ''}
          ${offset ? `OFFSET ${offset}` : ''}`,
          [userId],
        );
        if (senderNotifications.rowCount) return senderNotifications.rows;
        return [];
      };

      if (parseBool(roleplay)) {
        if (roleplay === 'recipient') {
          const recipientNotifications = await getRecipientNotifications();
          return res.status(200).json({
            notifications: recipientNotifications,
            totalLength: recipientNotifications.length,
          });
        }
        if (roleplay === 'sender') {
          const senderNotifications = await getSenderNotifications();
          return res.status(200).json({
            notifications: senderNotifications,
            totalLength: senderNotifications.length,
          });
        }
      }

      const recipientNotifications = await getRecipientNotifications();
      const senderNotifications = await getSenderNotifications();
      const notifications = [...recipientNotifications, ...senderNotifications];
      return res.status(200).json({
        notifications,
        totalLength: notifications.length,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatusNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const { read, id } = req.body;

      const updatedNotification = await db.query(
        `UPDATE users_notifications un 
         SET read = $1 
         FROM notifications n
         WHERE un.notification_id = n.id AND un.user_id = $2 RETURNING *`,
        [read, id],
      );

      if (updatedNotification.rows.length) return res.status(200).json(updatedNotification.rows[0]);

      return res.status(200).json([]);
    } catch (error) {
      next(error);
    }
  }

  async deleteNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deletedNotification = await db.query(`DELETE FROM notifications WHERE id = $1 RETURNING *;`, [id]);
      res.status(200).json(deletedNotification.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async deleteAllNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      await db.query(`DELETE FROM notifications *;`);
      res.status(200).json({ status: 'ok' });
    } catch (error) {
      next(error);
    }
  }
}

export default NotificationController;
