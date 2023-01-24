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
import { checkIsExistUser } from "./asyncMethods";
import { getUsdKoef, checkWallet, walletMethods } from "./wallets";
import {
  scrollToPosition,
  logoutUser,
  isValidateFilledForm,
  delay,
} from "./appMethods";

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
