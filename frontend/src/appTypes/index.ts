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
  IWalletConf,
  currencyBlockchainsType,
  IWalletContext,
} from "./wallet";
import { IUserAction } from "./user";
import {
  AlignText,
  IFont,
  keyPeriodItems,
  IGoalAction,
  IEditGoalData,
  IWidgetGoalData,
  IStatAction,
  IEditStatData,
  IWidgetStatData,
  IAlert,
} from "./widgets";

interface ILoadingAction {
  type: string;
  payload: boolean;
}

interface IAnyAction {
  type: string;
  payload: any;
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
  IWalletMethods,
  IWalletConf,
  currencyBlockchainsType,
  IWalletContext,

  // widgets
  AlignText,
  IFont,
  keyPeriodItems,
  IGoalAction,
  IEditGoalData,
  IWidgetGoalData,
  IStatAction,
  IWidgetStatData,
  IEditStatData,
  IAlert,
};
