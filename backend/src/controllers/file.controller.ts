import { NextFunction, Request, Response } from 'express';
import { readdirSync } from 'fs';
import { fileUploadTypes, ISoundInfo } from 'types';
import { Stream } from 'stream';
import db from '../db.js';
import { assetsFolder, isProduction } from '../consts.js';

class FileController {
  async getDefaultImages(req: Request, res: Response, next: NextFunction) {
    try {
      const { type } = req.params;
      const images = readdirSync(`${assetsFolder}/${type}`);
      const pathImages = images.map((i) =>
        isProduction ? `/${assetsFolder}/${i}` : `${req.protocol}://${req.headers.host}/${assetsFolder}/${type}/${i}`,
      );
      res.status(200).json(pathImages);
    } catch (error) {
      next(error);
    }
  }

  async getSounds(req: Request, res: Response, next: NextFunction) {
    try {
      const soundsFolderName: fileUploadTypes = 'sounds';
      const { user_id } = req.params;
      const sounds = readdirSync(`${assetsFolder}/${soundsFolderName}`);

      const pathSounds: ISoundInfo[] = sounds.map((name) => ({
        name,
        link: isProduction
          ? `/${assetsFolder}/${name}`
          : `${req.protocol}://${req.headers.host}/${assetsFolder}/${soundsFolderName}/${name}`,
      }));
      res.status(200).json(pathSounds);
    } catch (error) {
      next(error);
    }
  }

  async getSound(req: Request, res: Response, next: NextFunction) {
    try {
      const { type } = req.params;
      const images = readdirSync(`${assetsFolder}/${type}`);
      const pathImages = images.map((i) =>
        isProduction ? `/${assetsFolder}/${i}` : `${req.protocol}://${req.headers.host}/${assetsFolder}/${type}/${i}`,
      );

      // const data = await db.query('SELECT * FROM goals WHERE creator_id = $1', [creator_id]);

      res.status(200).json(pathImages);
    } catch (error) {
      next(error);
    }
  }

  // const bufferStream = new Stream.PassThrough();
  // bufferStream.end(Buffer.from(response.audioContent));
  // bufferStream.pipe(res);
}

export default FileController;
