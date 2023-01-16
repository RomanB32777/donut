import {
  IAlertData,
  ICurrentPeriodItemsTypes,
  IGoalData,
  IStatData,
} from "types";
import { IFileInfo } from "./files";

type AlignText = "left" | "center" | "right";

interface IFont {
  name: string;
  link: string;
}

// goals
interface IGoalAction {
  type: string;
  payload: IGoalData[];
}

interface IWidgetGoalData extends IGoalData<IFont> {}

// stats
interface IStatAction {
  type: string;
  payload: IStatData[];
}

type keyPeriodItems = keyof ICurrentPeriodItemsTypes;

interface IWidgetStatData extends IStatData<IFont> {
  custom_period?: string;
}

// alert
interface IAlert extends IAlertData<IFont, IFileInfo> {}

export type {
  AlignText,
  IFont,
  keyPeriodItems,
  IGoalAction,
  IWidgetGoalData,
  IStatAction,
  IWidgetStatData,
  IAlert,
};
