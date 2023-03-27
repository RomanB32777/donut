import { Repository } from 'typeorm';
import { UnsupportedMediaTypeException } from '@nestjs/common';

const getRandomStr = (length: number) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const getDefaultValues = <T>(
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

const fileMimetypeFilter =
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

export { getRandomStr, getDefaultValues, fileMimetypeFilter };
