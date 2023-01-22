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

const isValidateFilledForm = (valuesArray: any[]) =>
  valuesArray.every((val) => Boolean(val));

const delay = ({ ms, cb }: { ms: number; cb: (params?: any) => any }) =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      cb();
      resolve();
    }, ms);
  });

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
  isValidateFilledForm,
  delay,
};
