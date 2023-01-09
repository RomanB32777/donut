import { NextFunction, Request, Response } from 'express';
import { readdirSync, existsSync } from 'fs';
import { ISoundInfo } from 'types/index.js';
import { assetsFolder, isProduction, soundsFolderName, uploadsFolder } from '../consts.js';

class FileController {
  async getDefaultImages(req: Request, res: Response, next: NextFunction) {
    try {
      const { type } = req.params;
      const images = readdirSync(`${assetsFolder}/${type}`);
      const pathImages = images.map((i) => {
        const filePath = `${assetsFolder}/${type}/${i}`;
        return isProduction ? `/${filePath}` : `${req.protocol}://${req.headers.host}/${filePath}`;
      });
      res.status(200).json(pathImages);
    } catch (error) {
      next(error);
    }
  }

  async getSounds(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.params;
      const defaultFilesPath = `${assetsFolder}/${soundsFolderName}`;
      const uploadsFilesPath = `${uploadsFolder}/${username}/${soundsFolderName}`;

      const defaultSounds = readdirSync(defaultFilesPath);
      const uploadedSounds = existsSync(uploadsFilesPath) && readdirSync(uploadsFilesPath);

      const pathDefaultSounds: ISoundInfo[] = defaultSounds.map((name) => ({
        name,
        link: isProduction
          ? `/${defaultFilesPath}/${name}`
          : `${req.protocol}://${req.headers.host}/${defaultFilesPath}/${name}`,
      }));

      const pathUploadedSounds: ISoundInfo[] = uploadedSounds
        ? uploadedSounds.map((name) => ({
            name,
            link: isProduction
              ? `/${uploadsFilesPath}/${name}`
              : `${req.protocol}://${req.headers.host}/${uploadsFilesPath}/${name}`,
            isUploaded: true,
          }))
        : [];

      res.status(200).json([...pathUploadedSounds, ...pathDefaultSounds]);
    } catch (error) {
      next(error);
    }
  }
}

export default FileController;
