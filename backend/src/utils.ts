import { ethers } from 'ethers'
import { blockchainsSymbols } from 'types/index.js';
import { exchangeNames } from './consts.js';
import db from './db.js';
import axiosDefault from './modules/axiosDefault.js';

const isNotEmptyObject = (obj: Record<never, never>) => Boolean(Object.keys(obj).length);

const getRandomStr = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const parseBool = (param: any) =>
  !(param === 'false' || param === '0' || param === '' || param === 'null' || param === undefined);

const getUsername = () => `
  CASE
    WHEN d.is_anonymous THEN 'anonymous'
    ELSE u.username
  END
  AS username,`;

const getDBUsdKoef = async (timeout?: string) => {
  const exchangedCrypto = await db.query(`
    SELECT coin, price
    FROM exchange_crypto
    ${timeout ? `WHERE date_trunc('${timeout}', update_at) = date_trunc('${timeout}', current_timestamp)` : ''}
  `);

  if (exchangedCrypto.rowCount)
    return exchangedCrypto.rows.reduce((acc, row) => ({ ...acc, [row.coin]: Number(row.price) }), {});
  return {};
};

const getApiUsdKoef = async (initExchanges: Record<string, number>) => {
  try {
    for await (const blockchain of Object.keys(exchangeNames)) {
      const exchangeName = exchangeNames[blockchain as blockchainsSymbols];
      const { data, status } = await axiosDefault.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${exchangeName}&vs_currencies=usd`,
      );
      if (status === 200 && data[exchangeName])
        initExchanges = { ...initExchanges, [blockchain]: +data[exchangeName].usd };
    }

    const blockchainCoins = Object.keys(initExchanges);

    if (blockchainCoins.length) {
      await db.query(
        `INSERT INTO exchange_crypto (coin, price)
          VALUES ${blockchainCoins.map((coin) => `('${coin}', ${initExchanges[coin]})`)}
          ON CONFLICT (coin)
          DO UPDATE set price = EXCLUDED.price, update_at=now()
        `,
      );
      return initExchanges;
    }
    return {};
  } catch (error) {
    if (axiosDefault.isAxiosError(error)) console.log(error.message);
    return {};
  }
};

const getUsdKoef = async () => {
  // : { [key in exchangeNameTypes]: number }
  try {
    let exchanges: Record<string, number> = await getDBUsdKoef('hour');

    if (isNotEmptyObject(exchanges)) return exchanges;
    else {
      exchanges = await getApiUsdKoef(exchanges);
      if (!isNotEmptyObject(exchanges)) exchanges = await getDBUsdKoef();
    }
    return exchanges;
  } catch (error) {
    console.log('getUsdKoef error');
  }
};

export { axiosDefault, isNotEmptyObject, parseBool, getUsername, getRandomStr, getUsdKoef };
