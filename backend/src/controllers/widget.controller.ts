import { NextFunction, Request, Response } from 'express';
import { Stream } from 'stream';
import fileUpload, { UploadedFile } from 'express-fileupload';
import { existsSync, readdirSync } from 'fs';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import googlePkg from '@google-cloud/text-to-speech/build/protos/protos.js';
import {
  IWidgetQueryData,
  IAlertData,
  IEditGoalData,
  IGoalDataBase,
  IEditStatData,
  IStatDataBase,
  IGoalData,
} from 'types';

import db from '../db.js';
import { getRandomStr, parseBool } from '../utils.js';
import {
  assetsFolder,
  initAlertWidget,
  initGoalWidget,
  initStatWidget,
  isProduction,
  soundsFolderName,
  uploadsFolder,
} from '../consts.js';
import { HttpCode, RequestBody, RequestBodyWithFile, RequestParams, RequestQuery, ResponseBody } from '../types.js';

type genderVoices = keyof typeof googlePkg.google.cloud.texttospeech.v1.SsmlVoiceGender;

const speechClient = new TextToSpeechClient();

const setDefaultAlertSound = async ({ id, developHost }: { id: string; developHost: string }) => {
  const defaultFilesPath = `${assetsFolder}/${soundsFolderName}`;
  const defaultSounds = readdirSync(defaultFilesPath);
  const newSound = defaultSounds[0];
  const updatedAlertWidget = await db.query(
    `UPDATE alerts SET 
              sound = $1
              WHERE id = $2 RETURNING *;`,
    [isProduction ? `/${defaultFilesPath}/${newSound}` : `${developHost}/${defaultFilesPath}/${newSound}`, id],
  );
  return updatedAlertWidget.rows[0];
};

class WidgetController {
  // alerts
  async editAlertsWidget(
    req: Request<RequestParams, ResponseBody, RequestBodyWithFile<IAlertData>, RequestQuery>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { username, filelink, isReset, userID, id, data, banner, ...alertData } = req.body;

      if (isReset) {
        const { id: initID, creator_id: initCreator, ...initData } = initAlertWidget;

        const updatedAlert = await db.query<IAlertData>(
          `UPDATE alerts SET ${Object.keys(initData).map(
            (key) => `${key} = DEFAULT`,
          )} WHERE creator_id = $1 AND id = $2 RETURNING *`,
          [userID, id],
        );
        const updatesWithDefaultSound = await setDefaultAlertSound({
          id: updatedAlert.rows[0].id,
          developHost: `${req.protocol}://${req.headers.host}`,
        });
        return res.status(HttpCode.OK).json(updatesWithDefaultSound);
      }

      const dataKeys = Object.keys(alertData);
      const dataValues = Object.values(alertData);

      const updatedDBWidget = await db.query<IAlertData>(
        `UPDATE alerts SET 
            ${dataKeys.map((key, index) => `${key} = $${index + 1}`)}
            WHERE creator_id = ${userID} AND id = '${id}' RETURNING *;`,
        [...dataValues],
      );
      const updatedWidget = updatedDBWidget.rows[0];

      if (!updatedWidget) res.sendStatus(HttpCode.NOT_FOUND);

      if (req.files) {
        const file: fileUpload.UploadedFile = req.files.file as UploadedFile;
        const filename = getRandomStr(32) + file.name.slice(file.name.lastIndexOf('.'));
        const filepath = `${uploadsFolder}/${username}/alert/${filename}`;

        const updatedBannerWidget = await db.query<IAlertData>(
          `UPDATE alerts SET 
              banner = $1
              WHERE creator_id = $2 RETURNING *;`,
          [(isProduction ? '/' : `${req.protocol}://${req.headers.host}/`) + filepath, updatedWidget.creator_id],
        );

        file.mv(filepath, (err) => err && console.log(err));

        return res.status(HttpCode.OK).json({ ...updatedWidget, banner: updatedBannerWidget.rows[0].banner });
      } else if (filelink && filelink !== updatedWidget.banner) {
        await db.query(
          `UPDATE alerts SET 
              banner = $1
              WHERE creator_id = $2 AND id = $3 RETURNING *;`,
          [filelink, updatedWidget.creator_id, id],
        );
        return res.status(HttpCode.OK).json({ ...updatedWidget, banner: filelink });
      }
      return res.status(HttpCode.OK).json(updatedWidget);
    } catch (error) {
      next(error);
    }
  }

  async getAlertsWidgetData(
    req: Request<IWidgetQueryData, ResponseBody, RequestBody, RequestQuery>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { username, id } = req.params;
      const data = await db.query<IAlertData>(
        `
          SELECT a.* FROM alerts a
          LEFT JOIN users u
          ON u.id = a.creator_id
          WHERE u.username = $1 ${id ? `AND a.id = '${id}'` : ''}
      `,
        [username],
      );

      const alertInfo = data.rows[0];
      if (alertInfo) {
        const { id, sound, banner } = alertInfo;
        const appLink = `${req.protocol}://${req.headers.host}/`;
        const soundPath = isProduction ? sound.slice(1) : sound.split(appLink)[1];
        const bannerPath = isProduction ? banner.slice(1) : banner.split(appLink)[1];

        if (!parseBool(soundPath) || !existsSync(soundPath)) {
          const updatedAlertWidget = await setDefaultAlertSound({
            id,
            developHost: `${req.protocol}://${req.headers.host}`,
          });
          return res.status(HttpCode.OK).json(updatedAlertWidget);
        }

        if (!parseBool(bannerPath) || !existsSync(bannerPath)) {
          const updatedAlertWidget = await db.query(
            `UPDATE alerts SET 
              banner = ''
              WHERE id = $1 RETURNING *;`,
            [id],
          );
          return res.status(HttpCode.OK).json(updatedAlertWidget.rows[0]);
        }
        return res.status(HttpCode.OK).json(alertInfo);
      }
      return res.sendStatus(HttpCode.NOT_FOUND);
    } catch (error) {
      next(error);
    }
  }

  // goals
  async createGoalWidget(
    req: Request<RequestParams, ResponseBody, IGoalDataBase, RequestQuery>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { title, amount_goal, creator_id } = req.body;
      const id = getRandomStr(6);
      const newGoalWidget = await db.query(
        `INSERT INTO goals (id, title, amount_goal, creator_id) values ($1, $2, $3, $4) RETURNING *;`,
        [id, title, amount_goal, creator_id],
      );
      return res.status(HttpCode.CREATED).json(newGoalWidget.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async getGoalWidgets(req: Request, res: Response, next: NextFunction) {
    try {
      const { creator_id } = req.params;
      const data = await db.query('SELECT * FROM goals WHERE creator_id = $1 ORDER BY created_at DESC', [creator_id]);
      return res.status(HttpCode.OK).json(data.rows);
    } catch (error) {
      next(error);
    }
  }

  async getGoalWidget(
    req: Request<IWidgetQueryData, ResponseBody, RequestBody, RequestQuery>,
    res: Response,
    next: NextFunction,
  ) {
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
      if (data.rowCount) return res.status(HttpCode.OK).json(data.rows[0]);
      return res.sendStatus(HttpCode.NOT_FOUND);
    } catch (error) {
      next(error);
    }
  }

  async editGoalWidget(
    req: Request<RequestParams, ResponseBody, IEditGoalData, RequestQuery>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { goalData, creator_id, id, isReset, donat } = req.body;

      if (isReset && creator_id) {
        const updatedDBWidget = await db.query(
          `UPDATE goals SET ${Object.keys(initGoalWidget).map(
            (key) => `${key} = DEFAULT`,
          )} WHERE id = $1 AND creator_id = $2 RETURNING *`,
          [id, creator_id],
        );
        if (updatedDBWidget.rowCount) return res.status(HttpCode.OK).json(updatedDBWidget.rows[0]);
        return res.sendStatus(HttpCode.NOT_FOUND);
      }

      if (donat && creator_id) {
        const goalWidget = await db.query<IGoalData>(
          'SELECT id, amount_raised, amount_goal FROM goals WHERE id = $1 AND creator_id = $2',
          [id, creator_id],
        );
        if (goalWidget.rows[0]) {
          const { amount_raised, amount_goal, id } = goalWidget.rows[0];
          const updated_amount_raised =
            Number(amount_raised) + donat <= Number(amount_goal) ? Number(amount_raised) + donat : Number(amount_goal);

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

          if (updatedGoalWidget.rowCount) return res.status(HttpCode.OK).json(updatedGoalWidget.rows[0]);
          return res.sendStatus(HttpCode.NOT_FOUND);
        }
      }

      if (goalData) {
        const dataKeys = Object.keys(goalData);
        const updatedGoalWidget = await db.query(
          `UPDATE goals SET
                ${dataKeys.map((key, index) => `${key} = $${index + 1}`)}
                WHERE id = '${id}' AND creator_id = ${
            (goalData as IGoalDataBase).creator_id || creator_id
          } RETURNING *;`,
          [...Object.values(goalData)],
        );

        if (updatedGoalWidget.rowCount) return res.status(HttpCode.OK).json(updatedGoalWidget.rows[0]);
        return res.sendStatus(HttpCode.NOT_FOUND);
      }

      return res.sendStatus(HttpCode.NOT_FOUND);
    } catch (error) {
      next(error);
    }
  }

  async deleteGoalWidget(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deletedGoalWidget = await db.query(`DELETE FROM goals WHERE id = $1 RETURNING *;`, [id]);
      if (deletedGoalWidget.rowCount) return res.status(HttpCode.OK).json(deletedGoalWidget.rows[0]);
      return res.sendStatus(HttpCode.NOT_FOUND);
    } catch (error) {
      next(error);
    }
  }

  // stats
  async createStatWidget(
    req: Request<RequestParams, ResponseBody, IStatDataBase, RequestQuery>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { title, stat_description, template, data_type, time_period, creator_id } = req.body;
      const id = getRandomStr(6);
      const newStatWidget = await db.query(
        `INSERT INTO stats 
        (id, title, stat_description, template, data_type, time_period, creator_id) 
        values ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
        [id, title, stat_description, template, data_type, time_period, creator_id],
      );

      if (newStatWidget.rowCount) return res.status(HttpCode.CREATED).json(newStatWidget.rows[0]);
      return res.sendStatus(HttpCode.NOT_FOUND);
    } catch (error) {
      next(error);
    }
  }

  async getStatWidgets(req: Request, res: Response, next: NextFunction) {
    try {
      const { creator_id } = req.params;
      const data = await db.query('SELECT * FROM stats WHERE creator_id = $1 ORDER BY created_at DESC', [creator_id]);
      return res.status(HttpCode.OK).json(data.rows);
    } catch (error) {
      next(error);
    }
  }

  async getStatWidget(
    req: Request<IWidgetQueryData, ResponseBody, RequestBody, RequestQuery>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id, username } = req.params;
      const data = await db.query(
        `
          SELECT s.* FROM stats s
          LEFT JOIN users u
          ON u.id = s.creator_id
          WHERE u.username = $1 AND s.id = $2`,
        [username, id],
      );

      if (data.rowCount) return res.status(HttpCode.OK).json(data.rows[0]);
      return res.sendStatus(HttpCode.NOT_FOUND);
    } catch (error) {
      next(error);
    }
  }

  async editStatWidget(
    req: Request<RequestParams, ResponseBody, IEditStatData, RequestQuery>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { statData, id, isReset } = req.body;
      const { creator_id } = statData as IStatDataBase;

      if (isReset) {
        const updatedDBWidget = await db.query(
          `UPDATE stats SET ${Object.keys(initStatWidget).map((key) => `${key} = DEFAULT`)} 
          WHERE id = $1 AND creator_id = $2 RETURNING *`,
          [id, creator_id],
        );
        if (updatedDBWidget.rowCount) return res.status(HttpCode.OK).json(updatedDBWidget.rows[0]);
        return res.sendStatus(HttpCode.NOT_FOUND);
      }

      const dataKeys = Object.keys(statData);
      const updatedStatWidget = await db.query(
        `UPDATE stats SET
                ${dataKeys.map((key, index) => `${key} = $${index + 1}`)}
                WHERE id = '${id}' AND creator_id = ${creator_id} RETURNING *;`,
        [...Object.values(statData)],
      );

      if (updatedStatWidget.rowCount) return res.status(HttpCode.OK).json(updatedStatWidget.rows[0]);
      return res.sendStatus(HttpCode.NOT_FOUND);
    } catch (error) {
      next(error);
    }
  }

  async deleteStatWidget(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deletedStatWidget = await db.query(`DELETE FROM stats WHERE id = $1 RETURNING *;`, [id]);

      if (deletedStatWidget.rowCount) return res.status(HttpCode.OK).json(deletedStatWidget.rows[0]);
      return res.sendStatus(HttpCode.NOT_FOUND);
    } catch (error) {
      next(error);
    }
  }

  async generateSound(
    req: Request<RequestParams, ResponseBody, RequestBody, { text: string; gender_voice: genderVoices }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { text, gender_voice } = req.query;

      const voiceName = gender_voice === 'FEMALE' ? 'en-US-Neural2-C' : 'en-US-Neural2-A';

      const request: googlePkg.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
        input: { text: text.replaceAll('*', '') },
        voice: { languageCode: 'en-US', name: voiceName, ssmlGender: gender_voice }, // MALE | FEMALE
        audioConfig: { audioEncoding: 'MP3' },
      };

      res.set({
        'Content-Type': 'audio/mpeg',
        'Transfer-Encoding': 'chunked',
      });

      const [response] = await speechClient.synthesizeSpeech(request);
      if (response.audioContent) {
        const bufferStream = new Stream.PassThrough();
        bufferStream.end(Buffer.from(response.audioContent));
        bufferStream.pipe(res);
      }
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

        return res.status(HttpCode.CREATED).json({
          name: filename,
          link: isProduction ? `/${filepath}` : `${req.protocol}://${req.headers.host}/${filepath}`,
        });
      }
      return res.status(HttpCode.BAD_REQUEST).json({ message: 'error uploading' });
    } catch (error) {
      next(error);
    }
  }
}

export default WidgetController;
