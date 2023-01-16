import { NextFunction, Request, Response } from 'express';
import { Stream } from 'stream';
import fileUpload, { UploadedFile } from 'express-fileupload';
import { existsSync, readdirSync } from 'fs';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { google } from '@google-cloud/text-to-speech/build/protos/protos.js';
import db from '../db.js';
import { getRandomStr } from '../utils.js';
import { assetsFolder, isProduction, soundsFolderName, uploadsFolder } from '../consts.js';

// import dotenv from 'dotenv';
// dotenv.config();
// const speechClient = new TextToSpeechClient();

class WidgetController {
  // alerts
  async editAlertsWidget(req: Request, res: Response, next: NextFunction) {
    try {
      const { alertData, username, userId, filelink } = req.body;
      const parseData = JSON.parse(alertData);

      const dataKeys = Object.keys(parseData);
      const dataValues = Object.values(parseData);

      const updatedDBWidget = await db.query(
        `UPDATE alerts SET 
                ${dataKeys.map((key, index) => `${key} = $${index + 1}`)}
                WHERE creator_id = $${dataKeys.length + 1} RETURNING *;`,
        [...dataValues, userId],
      );
      const updatedWidget = updatedDBWidget.rows[0];

      if (!updatedWidget) res.status(204).json({});

      if (req.files) {
        const file: fileUpload.UploadedFile = req.files.file as UploadedFile;
        const filename = getRandomStr(32) + file.name.slice(file.name.lastIndexOf('.'));
        const filepath = `${uploadsFolder}/${username}/alert/${filename}`;

        const updatedBannerWidget = await db.query(
          `UPDATE alerts SET 
            banner = $1
            WHERE creator_id = $2 RETURNING *;`,
          [(isProduction ? '/' : `${req.protocol}://${req.headers.host}/`) + filepath, userId],
        );

        file.mv(filepath, (err) => err && console.log(err));

        return res.status(200).json({ ...updatedWidget, banner: updatedBannerWidget.rows[0].banner }); //
      } else if (filelink) {
        await db.query(
          `UPDATE alerts SET 
            banner = $1
            WHERE creator_id = $2 RETURNING *;`,
          [filelink, userId],
        );
        return res.status(200).json({ ...updatedWidget, banner: filelink });
      }
      return res.status(200).json(updatedWidget);
    } catch (error) {
      next(error);
    }
  }

  async getAlertsWidgetData(req: Request, res: Response, next: NextFunction) {
    try {
      const creator_id = req.params.creator_id;
      const data = await db.query('SELECT * FROM alerts WHERE creator_id = $1', [creator_id]);
      const alertInfo = data.rows[0];
      if (alertInfo) {
        const { sound, banner } = alertInfo;
        const appLink = `${req.protocol}://${req.headers.host}/`;
        const soundPath = isProduction ? sound.slice(1) : sound.split(appLink)[1];
        const bannerPath = isProduction ? banner.slice(1) : banner.split(appLink)[1];

        if (!existsSync(soundPath)) {
          const defaultFilesPath = `${assetsFolder}/${soundsFolderName}`;
          const defaultSounds = readdirSync(defaultFilesPath);
          const newSound = defaultSounds[0];
          const updatedAlertWidget = await db.query(
            `UPDATE alerts SET 
              sound = $1
              WHERE creator_id = $2 RETURNING *;`,
            [
              isProduction
                ? `/${defaultFilesPath}/${newSound}`
                : `${req.protocol}://${req.headers.host}/${defaultFilesPath}/${newSound}`,
              creator_id,
            ],
          );
          return res.status(200).json(updatedAlertWidget.rows[0]);
        }

        if (!existsSync(bannerPath)) {
          const updatedAlertWidget = await db.query(
            `UPDATE alerts SET 
              banner = ''
              WHERE creator_id = $1 RETURNING *;`,
            [creator_id],
          );
          return res.status(200).json(updatedAlertWidget.rows[0]);
        }
        return res.status(200).json(alertInfo);
      }
      return res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }

  // goals
  async createGoalWidget(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, amount_goal, creator_id } = req.body;
      const id = getRandomStr(6);
      const newGoalWidget = await db.query(
        `INSERT INTO goals (id, title, amount_goal, creator_id) values ($1, $2, $3, $4) RETURNING *;`,
        [id, title, amount_goal, creator_id],
      );
      res.status(200).json(newGoalWidget.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async getGoalWidgets(req: Request, res: Response, next: NextFunction) {
    try {
      const creator_id = req.params.creator_id;
      const data = await db.query('SELECT * FROM goals WHERE creator_id = $1', [creator_id]);
      res.status(200).json(data.rows);
    } catch (error) {
      next(error);
    }
  }

  async getGoalWidget(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, id } = req.params;

      const data = await db.query(
        `
          SELECT g.* FROM goals g 
          LEFT JOIN users u
          ON u.id = g.creator_id
          WHERE u.username = $1 AND g.id = $2`,
        [username, id],
      );
      res.status(200).json(data.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async editGoalWidget(req: Request, res: Response, next: NextFunction) {
    try {
      const { goalData, creator_id, id } = req.body;

      if (goalData.donat) {
        const goalWidget = await db.query(
          'SELECT id, amount_raised, amount_goal FROM goals WHERE creator_id = $1 AND id = $2',
          [creator_id, id],
        );
        if (goalWidget.rows[0]) {
          const { amount_raised, amount_goal, id } = goalWidget.rows[0];
          const updated_amount_raised =
            Number(amount_raised) + goalData.donat <= Number(amount_goal)
              ? Number(amount_raised) + goalData.donat
              : Number(amount_goal);
          let updatedGoalWidget = await db.query(
            `UPDATE goals SET 
                        amount_raised = $1
                        WHERE id = $2 RETURNING *;`,
            [Number(updated_amount_raised.toFixed(2)), id],
          );

          if (updated_amount_raised === Number(amount_goal))
            updatedGoalWidget = await db.query(
              `UPDATE goals SET 
                        isArchive = $1
                        WHERE id = $2 RETURNING *;`,
              [true, id],
            );

          res.status(200).json(updatedGoalWidget.rows[0]);
        }
      } else {
        const dataKeys = Object.keys(goalData);
        const updatedGoalWidget = await db.query(
          `UPDATE goals SET
              ${dataKeys.map((key, index) => `${key} = $${index + 1}`)}
              WHERE creator_id = ${creator_id} AND id = '${id}' RETURNING *;`,
          [...Object.values(goalData)],
        );
        return res.status(200).json(updatedGoalWidget.rows[0]);
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteGoalWidget(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deletedGoalWidget = await db.query(`DELETE FROM goals WHERE id = $1 RETURNING *;`, [id]);
      res.status(200).json(deletedGoalWidget.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  // stats
  async createStatWidget(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, stat_description, template, data_type, time_period, creator_id } = req.body;
      const id = getRandomStr(6);
      const newStatWidget = await db.query(
        `INSERT INTO stats (id, title, stat_description, template, data_type, time_period, creator_id) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
        [id, title, stat_description, template, data_type, time_period, creator_id],
      );
      res.status(200).json(newStatWidget.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async getStatWidgets(req: Request, res: Response, next: NextFunction) {
    try {
      const { creator_id } = req.params;
      const data = await db.query('SELECT * FROM stats WHERE creator_id = $1', [creator_id]);
      res.status(200).json(data.rows);
    } catch (error) {
      next(error);
    }
  }

  async getStatWidget(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const data = await db.query('SELECT * FROM stats WHERE id = $1', [id]);
      res.status(200).json(data.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async editStatWidget(req: Request, res: Response, next: NextFunction) {
    try {
      const { statData, id } = req.body;

      const dataKeys = Object.keys(statData);
      const updatedStatWidget = await db.query(
        `UPDATE stats SET
                ${dataKeys.map((key, index) => `${key} = $${index + 1}`)}
                WHERE id = '${id}' RETURNING *;`,
        [...Object.values(statData)],
      );
      return res.status(200).json(updatedStatWidget.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async deleteStatWidget(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deletedStatWidget = await db.query(`DELETE FROM stats WHERE id = $1 RETURNING *;`, [id]);
      res.status(200).json(deletedStatWidget.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async generateSound(req: Request, res: Response, next: NextFunction) {
    try {
      const { text, gender_voice } = req.query;
      const request = {
        input: { text },
        voice: { languageCode: 'en-US', ssmlGender: gender_voice }, // MALE // FEMALE
        audioConfig: { audioEncoding: 'MP3' },
      };

      res.set({
        'Content-Type': 'audio/mpeg',
        'Transfer-Encoding': 'chunked',
      });

      // const [response] = await speechClient.synthesizeSpeech(
      //   request as google.cloud.texttospeech.v1.ISynthesizeSpeechRequest,
      // );
      // if (response.audioContent) {
      //   const bufferStream = new Stream.PassThrough();
      //   bufferStream.end(Buffer.from(response.audioContent));
      //   bufferStream.pipe(res);
      // }
    } catch (error) {
      console.log(`api, ${error}`);
      next(error);
    }
  }

  async uploadSound(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.body;

      if (req.files) {
        const file: fileUpload.UploadedFile = req.files.file as UploadedFile;
        const filename = file.name;
        const filepath = `${uploadsFolder}/${username}/sound/${filename}`;

        file?.mv(filepath, (err) => err && console.log(err));

        // await db.query(
        //   `UPDATE alerts
        //     SET sound = $1
        //     WHERE creator_id = $2;`,
        //   [(isProduction ? '/' : `${req.protocol}://${req.headers.host}/`) + filepath, userId],
        // );
        return res.status(200).json({
          name: filename,
          link: isProduction ? filepath : `${req.protocol}://${req.headers.host}/${filepath}`,
        });
      }
      return res.status(500).json({ message: 'error uploading' });
    } catch (error) {
      next(error);
    }
  }
}

export default WidgetController;
