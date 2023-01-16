import { AnyAction, Dispatch } from "redux";
import { NavigateFunction } from "react-router-dom";

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
  getFontsList,
  checkFontObserver,
  loadFont,
  loadFonts,
  getFontColorStyles,
} from "./fontsMethods";

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
import { getUsdKoef, checkWallet, walletMethods } from "./wallets";
import { checkIsExistUser } from "./asyncMethods";
import { setUser } from "store/types/User";
import { setSelectedBlockchain } from "store/types/Wallet";
import { initUser, storageWalletKey } from "consts";

const getBadgesStatus = async (user: any, socket?: any) => {
  // const url =
  //   user.roleplay === "creators"
  //     ? `${baseURL}/api/badge/${user.id}?status=pending`
  //     : `${baseURL}/api/badge/badges-backer/${user.id}?status=pending`;
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

const logoutUser = ({
  dispatch,
  navigate,
}: {
  dispatch: Dispatch<AnyAction>;
  navigate: NavigateFunction;
}) => {
  dispatch(setUser(initUser));
  localStorage.removeItem(storageWalletKey);
  dispatch(setSelectedBlockchain(null));
  navigate("/");
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
  checkWallet,
  walletMethods,

  // async
  checkIsExistUser,

  // fonts
  getFontsList,
  checkFontObserver,
  loadFont,
  loadFonts,
  getFontColorStyles,

  // app
  scrollToPosition,
  logoutUser,
};
