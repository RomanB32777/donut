import { IBadgeData, periodItemsTypes } from "types";
import { IFileInfo } from "./files";
import {
  IWalletInitData,
  IPayObj,
  IQuantityBalanceObj,
  IMintBadgeObj,
  ICreateContractObj,
  IBlockchain,
  IWalletState,
  blockchainPayload,
  IBlockchainAction,
  IWalletMethods,
  IBlockchainData,
  methodNames,
  IWalletConf,
  currencyBlockchainsType,
  IWalletContext,
} from "./wallet";
import { IUserAction } from "./user";
import {
  INotificationsState,
  INotificationsAction,
  INotificationParams,
} from "./notifications";
import {
  AlignText,
  IFont,
  keyPeriodItems,
  IGoalAction,
  IWidgetGoalData,
  IStatAction,
  IWidgetStatData,
  IAlert,
} from "./widgets";
import {
  GetObjDifferentKeys,
  GetObjSameKeys,
  MergeTwoObjects,
  DeepMergeTwoTypes,
} from "./generics";

interface ILoadingAction {
  type: string;
  payload: boolean;
}

interface IAnyAction<P = any> {
  type: string;
  payload: P;
}

interface IFiltersForm {
  time_period: periodItemsTypes;
  custom_time_period: string[]; // startDate, endDate
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

interface IBadge extends IBadgeData {
  image: IFileInfo;
}

interface IStringObj {
  [key: string]: string;
}

export type {
  // app
  IFileInfo,
  IAnyAction,
  ILoadingAction,
  IFiltersForm,
  IFiltersDates,
  IDefaultImagesModal,
  typesTabContent,
  IBadge,
  IStringObj,

  // user
  IUserAction,

  // wallet
  IWalletInitData,
  IPayObj,
  IQuantityBalanceObj,
  IMintBadgeObj,
  ICreateContractObj,
  IBlockchain,
  IWalletState,
  blockchainPayload,
  IBlockchainAction,
  IBlockchainData,
  IWalletMethods,
  methodNames,
  IWalletConf,
  currencyBlockchainsType,
  IWalletContext,

  // notifications
  INotificationsState,
  INotificationsAction,
  INotificationParams,

  // widgets
  AlignText,
  IFont,
  keyPeriodItems,
  IGoalAction,
  IWidgetGoalData,
  IStatAction,
  IWidgetStatData,
  IAlert,

  // generics
  GetObjDifferentKeys,
  GetObjSameKeys,
  MergeTwoObjects,
  DeepMergeTwoTypes,
};
