import { NextFunction, Request, Response } from 'express';
import db from '../db.js';

class NotificationController {
  async getUserNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req.params;
      const { limit, offset, sort, sortDirection } = req.query;

      let userId = user;

      if (user.includes('@')) {
        const userInfo = await db.query(`SELECT id FROM users WHERE username = $1`, [user]);
        if (userInfo.rows[0]) userId = userInfo.rows[0].id;
      }

      const notifications = await db.query(
        `WITH un AS (
              SELECT un.*, u.username FROM users_notifications un
              LEFT JOIN users u ON u.id = un.user_id
          )
          SELECT n.id, n.created_at, 
            un.user_id, un.username, un.roleplay, un.read,
            to_jsonb(d) as donation, to_jsonb(b) as badge 
          FROM notifications n

          LEFT JOIN un
          ON un.notification_id = n.id
            
          LEFT JOIN donations d
          ON d.id = n.donation
            
          LEFT JOIN badges b
          ON b.id = n.badge
            
          WHERE un.user_id = $1

          ORDER BY ${sort || 'created_at'} ${sortDirection || 'DESC'}
          ${limit ? `LIMIT ${limit}` : ''}
          ${offset ? `OFFSET ${offset}` : ''}`,
        [userId],
      );

      if (notifications && notifications.rows.length) {
        return res.status(200).json({
          notifications: notifications.rows,
          totalLength: notifications.rowCount, //+notificationsAll[0].total_count,
        });
      }
      return res.status(200).json({ notifications: [] });
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
