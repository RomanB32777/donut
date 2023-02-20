import { IFileInfo, IDataWithFile } from "./files";
import {
  ProviderRpcError,
  IWalletInitData,
  IPayObj,
  IMintBadgeObj,
  IBlockchain,
  IWalletState,
  blockchainPayload,
  IWalletMethods,
  IBlockchainData,
  methodNames,
  IWalletConf,
  currencyBlockchainsType,
} from "./wallet";
import { IDonatPageWithFiles, IUserWithFiles } from "./user";
import { IBadge } from "./badges";
import {
  INotificationsState,
  INotificationParams,
  IVisibleNotification,
} from "./notifications";
import { IDonationWidgetInfo } from "./donations";
import {
  AlignText,
  IFont,
  keyPeriodItems,
  IWidgetGoalData,
  IWidgetStatData,
  IAlert,
  IDonationWidgetItem,
} from "./widgets";
import {
  GetObjDifferentKeys,
  GetObjSameKeys,
  MergeTwoObjects,
  DeepMergeTwoTypes,
} from "./generics";

interface IAnyAction<P = any> {
  type: string;
  payload: P;
}

interface IFiltersDates {
  start: number;
  end: number;
}

interface IDefaultImagesModal {
  images: string[];
  isOpen: boolean;
}

type typesTabContent = "All" | "Settings" | "Preview";

interface IStringObj {
  [key: string]: string;
}

export type {
  // files
  IFileInfo,
  IDataWithFile,

  // app
  IAnyAction,
  IFiltersDates,
  IDefaultImagesModal,
  typesTabContent,
  IBadge,
  IStringObj,

  // user
  IDonatPageWithFiles,
  IUserWithFiles,

  // wallet
  ProviderRpcError,
  IWalletInitData,
  IPayObj,
  IMintBadgeObj,
  IBlockchain,
  IWalletState,
  blockchainPayload,
  IBlockchainData,
  IWalletMethods,
  methodNames,
  IWalletConf,
  currencyBlockchainsType,

  // notifications
  INotificationsState,
  INotificationParams,
  IVisibleNotification,

  // donations
  IDonationWidgetInfo,

  // widgets
  AlignText,
  IFont,
  keyPeriodItems,
  IWidgetGoalData,
  IWidgetStatData,
  IAlert,
  IDonationWidgetItem,

  // generics
  GetObjDifferentKeys,
  GetObjSameKeys,
  MergeTwoObjects,
  DeepMergeTwoTypes,
};
