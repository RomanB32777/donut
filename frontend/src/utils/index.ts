import { getTimePeriodQuery } from "./dateMethods";
import {
  addNotification,
  addAuthNotification,
  addAuthWalletNotification,
  addErrorNotification,
  addSuccessNotification,
  addNotFoundUserNotification,
  addInstallWalletNotification,
  getDonatNotificationMessage,
  getBadgeNotificationMessage,
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

import { setFormDataValues } from "./filesMethods";
import {
  DateTimezoneFormatter,
  DateFormatter,
  getCurrentTimePeriodQuery,
  getStatsDataTypeQuery,
} from "./dateMethods";
import { walletMethods } from "./wallets";
import {
  scrollToPosition,
  isValidateFilledForm,
  formatNumber,
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
  getDonatNotificationMessage,
  getBadgeNotificationMessage,

  // strings
  getRandomStr,
  shortStr,
  copyStr,
  renderStrWithTokens,
  renderStatItem,

  // files
  setFormDataValues,

  // dates
  DateTimezoneFormatter,
  DateFormatter,
  getTimePeriodQuery,
  getCurrentTimePeriodQuery,
  getStatsDataTypeQuery,

  // wallets
  walletMethods,

  // fonts
  getFontsList,
  checkFontObserver,
  loadFont,
  loadFonts,
  getFontColorStyles,

  // app
  scrollToPosition,
  isValidateFilledForm,
  formatNumber,
  delay,
};
