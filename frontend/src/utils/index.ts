import axios from "axios";
import { getTimePeriodQuery } from "./dateMethods";
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

import { sendFile, getDefaultImages, getSounds } from "./filesMethods";
import {
  DateTimezoneFormatter,
  DateFormatter,
  getCurrentTimePeriodQuery,
  getStatsDataTypeQuery,
} from "./dateMethods";
import { getUsdKoef, walletMethods } from "./wallets";
import { checkIsExistUser } from "./asyncMethods";
import { ISelectItem } from "../components/SelectInput";

const getBadgesStatus = async (user: any, socket?: any) => {
  // const url =
  //   user.roleplay === "creators"
  //     ? `${baseURL}/api/badge/${user.id}?blockchain=${currBlockchain.name}&status=pending`
  //     : `${baseURL}/api/badge/badges-backer/${user.id}?blockchain=${currBlockchain.name}&status=pending`;
  // const { data } = await axiosClient.get(url);
  // if (Array.isArray(data) && data.length) {
  //   const pendingBadges = data; //.slice(0, 1);
  //   if (pendingBadges.length) {
  //     const resultTransactions = await Promise.all(
  //       pendingBadges.map(async (badge) => {
  //         const walletKey = process.env.REACT_APP_WALLET || "metamask";
  //         const wallet = walletsConf[walletKey];
  //         const transactionInfo = await wallet.getTransactionInfo(
  //           badge.transaction_hash
  //         );
  //         if (transactionInfo?.receipt) {
  //           const result = transactionInfo.receipt?.result;
  //           if (result) {
  //             const resultObj = {
  //               result,
  //               badge_id: badge.id,
  //               transaction_hash: badge.transaction_hash,
  //               username: user.username,
  //               user_id: user.id,
  //             };
  //             socket.emit("check_badge", resultObj);
  //             return resultObj;
  //           }
  //           return transactionInfo;
  //         }
  //         return null;
  //       })
  //     );
  //     return resultTransactions;
  //   }
  // }
};

const scrollToPosition = (top = 0) => {
  try {
    window.scroll({
      top: top,
      left: 0,
      behavior: "smooth",
    });
  } catch (_) {
    window.scrollTo(0, top);
  }
};

const getFontsList = async () => {
  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
    );
    if (data.items) {
      const resultList: ISelectItem[] = data.items
        .filter((font: any) => Boolean(font.files.regular))
        .map((font: any) => ({
          key: font.files.regular,
          value: font.family,
        }));

      return resultList || [];
    }
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

// const getDefaultImages = ({ count, folder }: IDefaultImages) => {
//   const images = [];
//   const baseImgUrl = `images/default-banners/${folder}`;
//   for (var i = 1; i <= count; i++)
//     images.push(
//       isProduction
//         ? `/${baseImgUrl}/${i}.jpg`
//         : `${baseURL}/${baseImgUrl}/${i}.jpg`
//     );
//   // images.push(require(`../assets/${folder}/${i}.jpg`));

//   return images;
// };

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
  getDefaultImages,
  getSounds,

  // dates
  DateTimezoneFormatter,
  DateFormatter,
  getTimePeriodQuery,
  getCurrentTimePeriodQuery,
  getStatsDataTypeQuery,

  // wallets
  getUsdKoef,
  walletMethods,

  // async
  checkIsExistUser,

  // app
  scrollToPosition,
  getFontsList,
};
