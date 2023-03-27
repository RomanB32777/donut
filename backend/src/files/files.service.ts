import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';
import { fileUploadTypes, IStaticFile } from 'types';

import { staticFolder, uploadsFolder, assetsFolder } from 'src/common/const';
import { getRandomStr } from 'src/utils';

@Injectable()
export class FilesService {
  uploadFile(
    file: Express.Multer.File,
    username: string,
    folderType: fileUploadTypes,
    isOriginalName = false,
  ): IStaticFile {
    try {
      const originalName = file.originalname;
      const fileExtension = originalName.slice(originalName.lastIndexOf('.'));
      const fileName = originalName.slice(0, originalName.lastIndexOf('.'));

      const name =
        (isOriginalName ? fileName : getRandomStr(32)) + fileExtension;

      const folderPath = [uploadsFolder, username, folderType];

      const filePath = resolve(
        __dirname,
        '..',
        '..',
        staticFolder,
        ...folderPath,
      );

      if (!existsSync(filePath)) mkdirSync(filePath, { recursive: true });

      const fullPath = join(filePath, name);
      writeFileSync(fullPath, file.buffer);

      return { path: `/${join(...folderPath, name)}`, name };
    } catch (error) {
      console.log(error);
      throw new HttpException('upload error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  getUploadsFiles(
    folderType: fileUploadTypes,
    username: string,
  ): IStaticFile[] {
    const folderPath = [uploadsFolder, username, folderType];

    const filePath = resolve(
      __dirname,
      '..',
      '..',
      staticFolder,
      ...folderPath,
    );

    if (!existsSync(filePath)) return [];

    const files = readdirSync(filePath);
    return files.map((fileName) => ({
      name: fileName,
      path: `/${join(...folderPath, fileName)}`,
    }));
  }

  getAssetsFiles(folderType: fileUploadTypes): IStaticFile[] {
    const folderPath = [assetsFolder, folderType];

    const filePath = resolve(
      __dirname,
      '..',
      '..',
      staticFolder,
      ...folderPath,
    );

    if (!existsSync(filePath)) return [];

    const files = readdirSync(filePath);
    return files.map((fileName) => ({
      name: fileName,
      path: `/${join(...folderPath, fileName)}`,
    }));
  }
}
