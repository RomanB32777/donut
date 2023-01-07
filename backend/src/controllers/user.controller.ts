import { NextFunction, Request, Response } from 'express';
import fileUpload, { UploadedFile } from 'express-fileupload';
import db from '../db.js';
import { getRandomStr } from '../utils.js';
import { IShortUserData } from 'types/index.js';
import { uploadsFolder, isProduction } from '../consts.js';

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
      const userId = newUserInfo.id;

      if (roleplay === 'creators') {
        const security_string = getRandomStr(10);
        await db.query(`INSERT INTO creators (user_id, security_string) values ($1, $2) RETURNING *`, [
          userId,
          security_string,
        ]);
        const alertID = getRandomStr(6);
        await db.query(`INSERT INTO alerts (id, creator_id) values ($1, $2) RETURNING *`, [alertID, userId]);
        return res.status(200).json(newUserInfo);
      } else {
        await db.query(`INSERT INTO backers (user_id) values ($1) RETURNING *`, [userId]); // username.toLowerCase(),
        return res.status(200).json(newUserInfo);
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deletedUser = await db.query(`DELETE FROM users WHERE id = $1 RETURNING *;`, [id]);
      res.status(200).json({ deletedUser: deletedUser.rows[0] });
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { address } = req.params;
      const user = await db.query(
        `
          SELECT u.*, to_jsonb(c.*) as donat_page
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
        `SELECT u.*, to_jsonb(c.*) as donat_page
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

  async editUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { welcome_text, btn_text, main_color, background_color, username, user_id } = req.body;
      let editedUser = {};

      const user = await db.query(`SELECT * FROM users WHERE id = $1`, [user_id]);

      if (username) {
        const editedUsername = await db.query(`UPDATE users SET username = $1 WHERE id = $2 RETURNING *`, [
          username,
          user.rows[0].id,
        ]);
        editedUser = {
          ...editedUser,
          username: editedUsername.rows[0].username,
        };
      } else {
        if (user.rows[0].roleplay === 'creators') {
          const editedDBUser = await db.query(
            `UPDATE creators SET welcome_text = $1, btn_text = $2, main_color = $3, background_color = $4 WHERE user_id = $5 RETURNING *`,
            [welcome_text, btn_text, main_color, background_color, user.rows[0].id],
          );
          editedUser = editedDBUser.rows[0];
        }
      }
      res.status(200).json({ editedUser });
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
