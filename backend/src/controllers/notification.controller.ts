import { NextFunction, Request, Response } from 'express';
import { INotification, INotificationQueries, notificationRoles } from 'types';
import db from '../db.js';
import { clean } from '../modules/badWords/index.js';
import { getUsername, parseBool } from '../utils.js';

const getOtherUsernameInAssigning = async ({
  notificationID,
  roleplay,
}: {
  notificationID: number;
  roleplay: notificationRoles;
}) => {
  const userInfo = await db.query(
    `
      SELECT u.username
      FROM notifications n

      LEFT JOIN users_notifications un
      ON un.notification_id = n.id

      LEFT JOIN users u 
      ON u.id = un.user_id

      WHERE n.id = $1 AND un.roleplay = $2
  `,
    [notificationID, roleplay],
  );
  if (userInfo.rowCount) return userInfo.rows[0].username;
  return null;
};
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
                
              WHERE un.user_id = $1 AND un.roleplay = 'recipient' AND un.visible = true

              ORDER BY ${sort || 'created_at'} ${sortDirection || 'DESC'}
              ${limit ? `LIMIT ${limit}` : ''}
              ${offset ? `OFFSET ${offset}` : ''}`,
          [userId],
        );
        if (recipientNotifications.rowCount) {
          const notifications: INotification[] = parseBool(spam_filter)
            ? recipientNotifications.rows.map((notification) => {
                const { donation } = notification;
                if (donation)
                  return {
                    ...notification,
                    donation: {
                      ...donation,
                      donation_message: donation.donation_message ? clean(donation.donation_message) : '-',
                    },
                  };
                return notification;
              })
            : recipientNotifications.rows;

          const notificationsWithBadgeInfo = await Promise.all(
            notifications.map(async (n) => {
              if (n.badge) {
                const senderUsername = await getOtherUsernameInAssigning({ notificationID: n.id, roleplay: 'sender' });
                if (senderUsername) return { ...n, sender: senderUsername };
              }
              return n;
            }),
          );
          return notificationsWithBadgeInfo;
        }
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
            
          WHERE un.user_id = $1 AND un.roleplay = 'sender' AND un.visible = true

          ORDER BY ${sort || 'created_at'} ${sortDirection || 'DESC'}
          ${limit ? `LIMIT ${limit}` : ''}
          ${offset ? `OFFSET ${offset}` : ''}`,
          [userId],
        );
        if (senderNotifications.rowCount) {
          const notifications: INotification[] = senderNotifications.rows;
          const notificationsWithBadgeInfo = await Promise.all(
            notifications.map(async (n) => {
              if (n.badge) {
                const recipientUsername = await getOtherUsernameInAssigning({
                  notificationID: n.id,
                  roleplay: 'recipient',
                });
                if (recipientUsername) return { ...n, recipient: recipientUsername };
              }
              return n;
            }),
          );
          return notificationsWithBadgeInfo;
        }
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

      const notifications = [...senderNotifications, ...recipientNotifications]
        .filter((n) => n.recipient || n.sender)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
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
      const { read, id, userID } = req.body;

      const updatedNotification = await db.query(
        `UPDATE users_notifications un 
         SET read = $1 
         FROM notifications n
         WHERE un.notification_id = n.id AND n.id = $2 AND un.user_id = $3 RETURNING *`,
        [read, id, userID],
      );

      if (updatedNotification.rowCount) return res.status(200).json(updatedNotification.rows[0]);

      return res.status(200).json([]);
    } catch (error) {
      next(error);
    }
  }

  async deleteNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, user } = req.params;
      const deletedUserNotification = await db.query(
        `UPDATE users_notifications 
         SET visible = false
         WHERE notification_id = $1 AND user_id = $2 RETURNING id;`,
        [id, user],
      );

      if (deletedUserNotification.rowCount) {
        await db.query(
          `WITH subquery AS (
            SELECT COUNT(*)
            FROM users_notifications 
            WHERE notification_id = $1 AND visible = true
          )
          DELETE FROM notifications
          USING subquery
          WHERE id = $1 AND (subquery.count = 0 OR subquery.count IS NULL)
          RETURNING id;`,
          [id],
        );
        return res.status(200).json(deletedUserNotification.rows[0]);
      }
      return res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }

  async deleteAllNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req.params;
      const notifications = await db.query(
        `UPDATE users_notifications 
          SET visible = false
          WHERE user_id = $1 RETURNING notification_id;`,
        [user],
      );

      if (notifications.rowCount) {
        const notificationIDs = notifications.rows.map((r) => r.notification_id);
        await db.query(
          `WITH subquery AS (
            SELECT COUNT(*)
            FROM users_notifications 
            WHERE visible = true
          )
          DELETE FROM notifications 
          USING subquery
          WHERE id in (${notificationIDs.join(', ')}) AND (subquery.count = 0 OR subquery.count IS NULL);`,
        );
        return res.status(200).json({ status: 'ok' });
      }
      return res.status(200).json([]);
    } catch (error) {
      next(error);
    }
  }
}

export default NotificationController;
