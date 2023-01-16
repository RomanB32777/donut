import {
  filterPeriodItems,
  filterCurrentPeriodItems,
  filterDataTypeItems,
} from "./dates";

import {
  alignItemsList,
  alignFlextItemsList,
  initAlertData,
  initBadgeData,
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
import {
  initFileInfo,
  initUser,
  initUserWithFiles,
  initDonatPage,
} from "./user";

import dummyImg from "assets/big_don.png";

const url = "/images/";
const widgetApiUrl = "/api/donation/widgets";

const ipfsFilename = "badge";
const ipfsFileformat = "jpg";

const adminPath = "admin";

const notVisibleFontsCount = 1;

export {
  // app
  url,
  widgetApiUrl,
  ipfsFilename,
  ipfsFileformat,
  adminPath,
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

  // widgets
  alignItemsList,
  alignFlextItemsList,
  initAlertData,
  initBadgeData,
  initWidgetGoalData,
  initWidgetStatData,

  // user
  initFileInfo,
  initUser,
  initDonatPage,
  initUserWithFiles,
};
