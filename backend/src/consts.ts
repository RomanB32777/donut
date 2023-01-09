import { fileUploadTypes } from 'types';

const assetsFolder = 'assets';
const uploadsFolder = 'uploads';
const soundsFolderName: fileUploadTypes = 'sound';

const isProduction = process.env.NODE_ENV === 'production';

export { assetsFolder, uploadsFolder, soundsFolderName, isProduction };
