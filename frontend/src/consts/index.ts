import {
  filterPeriodItems,
  filterCurrentPeriodItems,
  filterDataTypeItems,
} from "./dates";
import {
  alignItemsList,
  alignFlextItemsList,
  initAlertData,
  initWidgetGoalData,
  initWidgetStatData,
} from "./widgets";
import {
  storageWalletKey,
  initBlockchainData,
  walletInfo,
  mainAbi,
  transferAbi,
  commissionAbi,
} from "./wallet";
import { initSendDonatData, initDonationData } from "./donations";
import { initBadgeData, initBadgeDataWithoutFile } from "./badges";
import {
  initFileInfo,
  initUser,
  initUserWithFiles,
  shortUserInfo,
  initDonatPage,
} from "./user";

import dummyImg from "assets/big_don.png";

const isProduction = process.env.REACT_APP_NODE_ENV === "production";

const baseURL =
  `${isProduction ? "https" : "http"}://${window.location.hostname}` +
  (!isProduction ? `:${process.env.REACT_APP_BACKEND_PORT || 4000}` : "");

const socketsBaseUrl = `http://${window.location.hostname}:4005`;

// const url = "/images/";
const widgetApiUrl = "/api/donation/widgets";

const ipfsFilename = "badge";
const ipfsFileformat = "jpg";

const notVisibleFontsCount = 1;

export {
  // app
  isProduction,
  baseURL,
  socketsBaseUrl,
  widgetApiUrl,
  ipfsFilename,
  ipfsFileformat,
  dummyImg,
  notVisibleFontsCount,

  // dates
  filterPeriodItems,
  filterCurrentPeriodItems,
  filterDataTypeItems,

  // wallet
  storageWalletKey,
  initBlockchainData,
  walletInfo,
  mainAbi,
  transferAbi,
  commissionAbi,

  // donations
  initSendDonatData,
  initDonationData,

  // badges
  initBadgeData,
  initBadgeDataWithoutFile,

  // widgets
  alignItemsList,
  alignFlextItemsList,
  initAlertData,
  initWidgetGoalData,
  initWidgetStatData,

  // user
  initFileInfo,
  initUser,
  initDonatPage,
  initUserWithFiles,
  shortUserInfo,
};
