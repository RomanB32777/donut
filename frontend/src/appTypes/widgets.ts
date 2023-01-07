import {
  IAlertBase,
  ICurrentPeriodItemsTypes,
  IGoalData,
  IStatData,
  typeAligmnet,
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

interface IEditGoalData {
  title_color: string;
  progress_color: string;
  background_color: string;
}

interface IWidgetGoalData {
  widgetAmount: string;
  widgetDescription: string;
  id?: number;
}

// stats
interface IStatAction {
  type: string;
  payload: IStatData[];
}

interface IEditStatData {
  title_color: string;
  bar_color: string;
  content_color: string;
  aligment: typeAligmnet;
}

type keyPeriodItems = keyof ICurrentPeriodItemsTypes;

interface IWidgetStatData {
  title: string;
  stat_description: string;
  template: string | string[];
  data_type: string; // value of statsDataTypes ???
  time_period: keyPeriodItems;
  custom_period?: string;
  id?: number;
}

// alert
interface IAlert extends IAlertBase {
  banner: IFileInfo;
  message_font: IFont;
  name_font: IFont;
  sum_font: IFont;
}

export type {
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
};
