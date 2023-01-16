import { fileUploadTypes, BlockchainNameToExchangeName } from 'types';

const assetsFolder = 'assets';
const uploadsFolder = 'uploads';
const soundsFolderName: fileUploadTypes = 'sound';

const isProduction = process.env.NODE_ENV === 'production';

const exchangeNames: BlockchainNameToExchangeName = {
  KLAY: 'klay-token',
  ETHs: 'evmos',
  AGOR: 'ethereum',
  tBNB: 'binancecoin',
  AVAX: 'avalanche-2',
  MATIC: 'matic-network',
};

export { assetsFolder, uploadsFolder, soundsFolderName, isProduction, exchangeNames };
