import { NextFunction, Request, Response } from 'express';
import fileUpload, { UploadedFile } from 'express-fileupload';
import { existsSync, rmSync } from 'fs';
import { DatabaseError } from 'pg';
import { IShortUserData, IEditUserInfo, IUser, ISendingDataWithFile, donatAssetTypes, fileUploadTypes } from 'types';

import db from '../db.js';
import { getRandomStr, parseBool } from '../utils.js';
import { uploadsFolder, isProduction, initDonatPage, uploadsFolderTypes } from '../consts.js';
import { RequestParams, ResponseBody, RequestQuery, HttpCode } from '../types.js';

class UserController {
  async checkUserExist(req: Request, res: Response, next: NextFunction) {
    try {
      const { field } = req.params; // field - address/username
      const user = await db.query('SELECT * FROM users WHERE wallet_address = $1 OR username = $1', [field]);
      if (!user.rowCount) return res.status(HttpCode.OK).json(false);

      return res.status(HttpCode.OK).json(true);
    } catch (error) {
      next(error);
    }
  }

  async createUser(
    req: Request<RequestParams, ResponseBody, IShortUserData, RequestQuery>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { username, wallet_address, roleplay } = req.body;

      const newUser = await db.query<IUser>(
        `INSERT INTO users (wallet_address, username, roleplay) values ($1, $2, $3) RETURNING *;`,
        [wallet_address, (username.includes('@') ? username : `@${username}`).toLowerCase(), roleplay],
      );
      const newUserInfo = newUser.rows[0];

      if (newUserInfo) {
        const { id } = newUserInfo;

        if (roleplay === 'creators') {
          const alertID = getRandomStr(6);
          await db.query(`INSERT INTO creators (user_id) values ($1) RETURNING *`, [id]);
          await db.query(`INSERT INTO alerts (id, creator_id) values ($1, $2) RETURNING *`, [alertID, id]);
        }
        return res.status(HttpCode.CREATED).json(newUserInfo);
      }
      return res.sendStatus(HttpCode.NOT_FOUND);
    } catch (error) {
      const dbError = error as DatabaseError;
      if (dbError.code == '23505')
        return res
          .status(HttpCode.BAD_REQUEST)
          .json({ message: 'Unfortunately, this username is already busy. Enter another one' });

      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deletedUser = await db.query<IUser>(`DELETE FROM users WHERE id = $1 RETURNING *;`, [id]);
      if (deletedUser.rows[0]) {
        const { username } = deletedUser.rows[0];
        const uploadsFilesPath = `${uploadsFolder}/${username}`;
        if (existsSync(uploadsFilesPath)) {
          // firstly check is exist bages folder
          if (!existsSync(`${uploadsFilesPath}/${uploadsFolderTypes.badges}`)) {
            rmSync(uploadsFilesPath, { recursive: true });
          } else {
            const uploadFolderNames = Object.keys(uploadsFolderTypes);
            uploadFolderNames.forEach((folderName) => {
              const typeFolder = folderName as fileUploadTypes;
              if (typeFolder !== 'badges') {
                const pathname = `${uploadsFilesPath}/${typeFolder}`;
                existsSync(pathname) && rmSync(pathname, { recursive: true });
              }
            });
          }
        }
      }

      if (deletedUser.rowCount) return res.status(HttpCode.OK).json(deletedUser.rows[0]);
      return res.sendStatus(HttpCode.NOT_FOUND);
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
      if (user.rowCount) return res.status(HttpCode.OK).json(user.rows[0]);
      return res.sendStatus(HttpCode.NOT_FOUND);
    } catch (error) {
      next(error);
    }
  }

  async getUserByID(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);
      if (user.rowCount) return res.status(HttpCode.OK).json(user.rows[0]);
      return res.sendStatus(HttpCode.NOT_FOUND);
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
      );
      if (creator.rowCount) return res.status(HttpCode.OK).json(creator.rows[0]);
      return res.status(HttpCode.NOT_FOUND).json('User with this username not found!');
    } catch (error) {
      next(error);
    }
  }

  async editUser(
    req: Request<RequestParams, ResponseBody, IEditUserInfo, RequestQuery>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { donat_page, spam_filter, id, isReset } = req.body;

      const user = await db.query<IUser>(`SELECT * FROM users WHERE id = $1`, [id]);

      if (user.rowCount) {
        const { id, roleplay } = user.rows[0];

        if (isReset) {
          const editedUser = await db.query(
            `UPDATE creators SET ${Object.keys(initDonatPage).map(
              (key) => `${key} = DEFAULT`,
            )} WHERE user_id = $1 RETURNING *`,
            [id],
          );
          return res.status(HttpCode.OK).json(editedUser.rows[0]);
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
            return res.status(HttpCode.OK).json(editedUser.rows[0]);
          }
        }

        if (parseBool(spam_filter))
          await db.query(`UPDATE creators SET spam_filter = $1 WHERE user_id = $2 RETURNING *`, [spam_filter, id]);

        const bodyKeyFields = Object.keys(req.body).filter(
          (field) => field !== 'id' && field !== 'spam_filter',
        ) as Array<keyof IEditUserInfo>;

        const changedFields = bodyKeyFields.map((field) => req.body[field]);

        if (changedFields.length) {
          const editedUser = await db.query(
            `UPDATE users SET ${bodyKeyFields
              .map((field, index) => `${field} = $${index + 1}`)
              .join(', ')} WHERE id = ${id} RETURNING *`,
            [...changedFields],
          );
          return res.status(HttpCode.OK).json(editedUser.rows[0]);
        }
        return res.sendStatus(HttpCode.NO_CONTENT);
      }
      return res.sendStatus(HttpCode.NOT_FOUND);
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
        const filepath = `${uploadsFolder}/${username}/${uploadsFolderTypes.avatar}/${filename}`;

        db.query(`UPDATE users SET avatar = $1 WHERE username = $2;`, [
          (isProduction ? '/' : `${req.protocol}://${req.headers.host}/`) + filepath,
          username,
        ]);

        file.mv(filepath, (err) => err && console.log(err));

        return res.sendStatus(HttpCode.NO_CONTENT);
      }
      return res.sendStatus(HttpCode.BAD_REQUEST);
    } catch (error) {
      next(error);
    }
  }

  async editCreatorImage(
    req: Request<{ type: donatAssetTypes }, ResponseBody, ISendingDataWithFile, RequestQuery>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { type } = req.params;
      const { username, userID, filelink } = req.body;
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
        [uploadedFileLink, userID],
      );
      return res.sendStatus(HttpCode.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
