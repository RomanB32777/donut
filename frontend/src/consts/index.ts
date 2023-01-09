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

import { storageWalletKey, initBlockchainData, walletInfo } from "./wallet";
import { initSendDonatData, initDonationData } from "./donations";
import { initUser } from "./user";

import dummyImg from "assets/big_don.png";

const url = "/images/";
const widgetApiUrl = "/api/donation/widgets";

const ipfsFilename = "badge";
const ipfsFileformat = "jpg";

const adminPath = "admin";

export {
  // app
  url,
  widgetApiUrl,
  ipfsFilename,
  ipfsFileformat,
  adminPath,
  dummyImg,

  // dates
  filterPeriodItems,
  filterCurrentPeriodItems,
  filterDataTypeItems,

  // wallet
  storageWalletKey,
  initBlockchainData,
  walletInfo,

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
  initUser,
};
