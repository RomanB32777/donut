import { Repository } from 'typeorm';
import { UnsupportedMediaTypeException } from '@nestjs/common';

export const getRandomStr = (length: number) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const getRepositoryFields = <T>(
  repository: Repository<T>,
  excludedFields?: (keyof T)[],
) => {
  const excludedArr = excludedFields || [];
  return repository.metadata.columns.reduce<(keyof T)[]>((acc, c) => {
    const name = c.propertyName as keyof T;
    if (!excludedArr.includes(name)) {
      acc.push(name);
    }
    return acc;
  }, []);
};

export const getDefaultValues = <T>(
  repository: Repository<T>,
  excludedFields?: (keyof T)[],
) => {
  const excludedArr = excludedFields || [];

  return repository.metadata.columns.reduce((acc, c) => {
    const name = c.propertyName as keyof T;
    if (
      ['string', 'number', 'boolean'].includes(typeof c.default) &&
      !excludedArr.includes(name)
    ) {
      return { ...acc, [name]: c.default };
    }
    return acc;
  }, {} as Record<string, string | number>);
};

export const fileMimetypeFilter =
  (...mimetypes: string[]) =>
  (
    req: any,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (mimetypes.some((m) => file.mimetype.includes(m))) {
      callback(null, true);
    } else {
      callback(
        new UnsupportedMediaTypeException(
          `File type is not matching: ${mimetypes.join(', ')}`,
        ),
        false,
      );
    }
  };

export const delay = (ms: number, cb?: (params?: any) => any) =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      cb?.();
      resolve();
    }, ms);
  });
