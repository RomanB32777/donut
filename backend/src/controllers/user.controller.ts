import { NextFunction, Request, Response } from 'express';
import fileUpload, { UploadedFile } from 'express-fileupload';
import { existsSync, rmSync } from 'fs';
import { IShortUserData } from 'types';
import db from '../db.js';
import { getRandomStr } from '../utils.js';
import { uploadsFolder, isProduction, initDonatPage } from '../consts.js';
import { RequestParams, ResponseBody, RequestQuery, RequestBodyUser } from '../types.js';

class UserController {
  async checkUsername(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.params;
      const user = await db.query('SELECT * FROM users WHERE username = $1', [username]);
      if (user.rows.length > 0 && user.rows[0].username === username) {
        res.status(200).json({ error: true });
      } else {
        res.status(200).json({ error: false });
      }
    } catch (error) {
      next(error);
    }
  }

  async checkUserExist(req: Request, res: Response, next: NextFunction) {
    try {
      const { address } = req.params;
      const user = await db.query('SELECT * FROM users WHERE wallet_address = $1', [address]);
      if (user.rows && user.rows.length === 0) {
        res.status(200).json({ notExist: true });
      } else {
        res.status(200).json(user.rows[0]);
      }
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, wallet_address, roleplay } = req.body as IShortUserData;
      const newUser = await db.query(
        `INSERT INTO users (wallet_address, username, roleplay) values ($1, $2, $3) RETURNING *;`,
        [wallet_address, (username.includes('@') ? username : '@' + username).toLowerCase(), roleplay],
      );
      const newUserInfo = newUser.rows[0];

      if (newUserInfo) {
        const userId = newUserInfo.id;

        if (roleplay === 'creators') {
          const security_string = getRandomStr(10);
          const alertID = getRandomStr(6);
          await db.query(`INSERT INTO creators (user_id, security_string) values ($1, $2) RETURNING *`, [
            userId,
            security_string,
          ]);
          await db.query(`INSERT INTO alerts (id, creator_id) values ($1, $2) RETURNING *`, [alertID, userId]);
        }
        return res.status(200).json(newUserInfo);
      }
      return res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deletedUser = await db.query(`DELETE FROM users WHERE id = $1 RETURNING username;`, [id]);
      if (deletedUser.rows[0]) {
        const { username } = deletedUser.rows[0];
        const uploadsFilesPath = `${uploadsFolder}/${username}`;
        existsSync(uploadsFilesPath) && rmSync(uploadsFilesPath, { recursive: true });
      }
      res.status(200).json({ deletedUser: deletedUser.rows[0] });
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { address } = req.params;
      const user = await db.query(
        `SELECT u.*, 
            to_jsonb(c.*) - ARRAY['id', 'user_id', 'spam_filter'] as donat_page,
            c.spam_filter
          FROM users u
          LEFT JOIN creators c
          ON c.user_id = u.id
          WHERE wallet_address = $1
      `,
        [address],
      );
      if (user.rowCount) return res.status(200).json(user.rows[0]);
      return res.status(200).json({});
    } catch (error) {
      next(error);
    }
  }

  async getUserByID(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);
      res.status(200).json({ user: user.rows[0] });
    } catch (error) {
      next(error);
    }
  }

  async getCreatorByName(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.params;
      const creator = await db.query(
        `SELECT u.*, 
            to_jsonb(c.*) - ARRAY['id', 'user_id', 'spam_filter'] as donat_page,
            c.spam_filter
          FROM users u
          LEFT JOIN creators c
          ON c.user_id = u.id
         WHERE u.roleplay = 'creators' AND u.username = $1`,
        [username],
        // c.background_link, c.welcome_text, c.btn_text, c.main_color, c.background_color, c.security_string,
      );
      if (creator.rowCount) return res.status(200).json(creator.rows[0]);
      else return res.status(500).json('User with this username not found!');
    } catch (error) {
      next(error);
    }
  }

  async editUser(
    req: Request<RequestParams, ResponseBody, RequestBodyUser, RequestQuery>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { donat_page, spam_filter, id, isReset } = req.body;
      const user = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);

      if (user.rowCount) {
        const { id, roleplay } = user.rows[0];

        if (isReset) {
          const editedUser = await db.query(
            `UPDATE creators SET ${Object.keys(initDonatPage).map(
              (key) => `${key} = DEFAULT`,
            )} WHERE user_id = $1 RETURNING *`,
            [id],
          );
          return res.status(200).json(editedUser.rows[0]);
        }

        if (roleplay === 'creators' && donat_page) {
          const values = Object.values(donat_page);
          if (values.length) {
            const editedUser = await db.query(
              `UPDATE creators SET ${Object.keys(donat_page).map(
                (key, index) => `${key} = $${index + 1}`,
              )} WHERE user_id = ${id} RETURNING *`,
              [...values],
            );
            return res.status(200).json(editedUser.rows[0]);
          }
        }

        if (typeof spam_filter !== 'undefined')
          await db.query(`UPDATE creators SET spam_filter = $1 WHERE user_id = ${id} RETURNING *`, [spam_filter]);

        const bodyKeyFields = Object.keys(req.body).filter(
          (field: string) => field !== 'id' && field !== 'spam_filter',
        );
        const changedFields = bodyKeyFields.map((field) => req.body[field as keyof RequestBodyUser]);

        if (changedFields.length) {
          const editedUser = await db.query(
            `UPDATE users SET ${bodyKeyFields
              .map((field, index) => `${field} = $${index + 1}`)
              .join(', ')} WHERE id = ${id} RETURNING *`,
            [...changedFields],
          );
          return res.status(200).json(editedUser.rows[0]);
        }
      }
      return res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }

  async editUserImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.body;
      if (req.files) {
        const file: fileUpload.UploadedFile = req.files.file as UploadedFile;
        const filename = getRandomStr(32) + file.name.slice(file.name.lastIndexOf('.'));
        const filepath = `${uploadsFolder}/${username}/avatar/${filename}`;

        db.query(`UPDATE users SET avatar = $1 WHERE username = $2;`, [
          (isProduction ? '/' : `${req.protocol}://${req.headers.host}/`) + filepath,
          username,
        ]);

        file.mv(filepath, (err) => err && console.log(err));

        res.status(200).json({ message: 'success' });
      }
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }

  async editCreatorImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { type } = req.params;
      const { username, userId, filelink } = req.body;
      let uploadedFileLink = '';

      if (req.files) {
        const file: fileUpload.UploadedFile = req.files.file as UploadedFile;
        const filename = getRandomStr(32) + file.name.slice(file.name.lastIndexOf('.'));
        const filepath = `${uploadsFolder}/${username}/${type}/${filename}`;

        file?.mv(filepath, (err) => err && console.log(err));
        uploadedFileLink = (isProduction ? '/' : `${req.protocol}://${req.headers.host}/`) + filepath;
      } else if (filelink) uploadedFileLink = filelink;

      await db.query(
        `UPDATE creators
          SET ${type}_banner = $1 
          WHERE user_id = $2;`,
        [uploadedFileLink, userId],
      );
      return res.status(200).json({ message: 'success' });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
