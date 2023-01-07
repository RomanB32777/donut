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

import { initBlockchainData, walletInfo } from "./wallet";
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
  initBlockchainData,
  walletInfo,

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
