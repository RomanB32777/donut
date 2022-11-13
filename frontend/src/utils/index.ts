import axiosClient, { baseURL } from "./../axiosClient";
import { getTimePeriodQuery } from "./dateMethods/index";
import {
  addNotification,
  addAuthNotification,
  addAuthWalletNotification,
  addErrorNotification,
  addSuccessNotification,
  addNotFoundUserNotification,
  addInstallWalletNotification,
  getNotificationMessage,
} from "./notifications";

import {
  getRandomStr,
  shortStr,
  copyStr,
  renderStrWithTokens,
  renderStatItem,
} from "./stringMethods";

import { sendFile } from "./filesMethods";
import {
  DateTimezoneFormatter,
  DateFormatter,
  getCurrentTimePeriodQuery,
  getStatsDataTypeQuery,
} from "./dateMethods";
import { walletsConf, currBlockchain, getUsdKoef } from "./wallets";
import { checkIsExistUser } from "./asyncMethods";

const getBadgesStatus = async (user: any, socket?: any) => {
  const url =
    user.roleplay === "creators"
      ? `${baseURL}/api/badge/${user.id}?blockchain=${currBlockchain?.nativeCurrency.symbol}&status=pending`
      : `${baseURL}/api/badge/badges-backer/${user.id}?blockchain=${currBlockchain?.nativeCurrency.symbol}&status=pending`;

  const { data } = await axiosClient.get(url);
  if (Array.isArray(data) && data.length) {
    const pendingBadges = data; //.slice(0, 1);

    if (pendingBadges.length) {
      const resultTransactions = await Promise.all(
        pendingBadges.map(async (badge) => {
          const walletKey = process.env.REACT_APP_WALLET || "metamask";
          const wallet = walletsConf[walletKey];
          const transactionInfo = await wallet.getTransactionInfo(
            badge.transaction_hash
          );
          if (transactionInfo?.receipt) {
            const result = transactionInfo.receipt?.result;

            if (result) {
              const resultObj = {
                result,
                badge_id: badge.id,
                transaction_hash: badge.transaction_hash,
                username: user.username,
                user_id: user.id,
              };
              socket.emit("check_badge", resultObj);
              return resultObj;
            }
            return transactionInfo;
          }
          return null;
        })
      );
      return resultTransactions;
    }
  }
};

export {
  // notifications
  addNotification,
  addAuthNotification,
  addAuthWalletNotification,
  addErrorNotification,
  addSuccessNotification,
  addNotFoundUserNotification,
  addInstallWalletNotification,
  getNotificationMessage,

  // badges
  getBadgesStatus,

  // strings
  getRandomStr,
  shortStr,
  copyStr,
  renderStrWithTokens,
  renderStatItem,

  // files
  sendFile,

  // dates
  DateTimezoneFormatter,
  DateFormatter,
  getTimePeriodQuery,
  getCurrentTimePeriodQuery,
  getStatsDataTypeQuery,

  // wallets
  getUsdKoef,
  walletsConf,
  currBlockchain,

  // async
  checkIsExistUser,
};
