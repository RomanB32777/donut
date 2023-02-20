import {
  IAlertData,
  ICurrentPeriodItemsTypes,
  IGoalData,
  ISoundInfo,
  IStatData,
} from "types";
import { IDonationWidgetInfo } from "./donations";
import { IFileInfo } from "./files";

type AlignText = "left" | "center" | "right";

interface IFont {
  name: string;
  link: string;
}

// goals
interface IWidgetGoalData extends IGoalData<IFont> {}

// stats
type keyPeriodItems = keyof ICurrentPeriodItemsTypes;

interface IWidgetStatData extends IStatData<IFont> {
  custom_period?: any;
}

// alert
interface IAlert extends IAlertData<IFont, IFileInfo, ISoundInfo> {}

interface IDonationWidgetItem {
  donat: IDonationWidgetInfo;
}

export type {
  AlignText,
  IFont,
  keyPeriodItems,
  IWidgetGoalData,
  IWidgetStatData,
  IAlert,
  IDonationWidgetItem,
};
