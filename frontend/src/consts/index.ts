import {
  alignItemsList,
  alignFlextItemsList,
  initAlertData,
  initBadgeData,
} from "./widgets";
import walletInfo from "./wallet";

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

  // wallet
  walletInfo,

  // widgets
  alignItemsList,
  alignFlextItemsList,
  initAlertData,
  initBadgeData,
};
