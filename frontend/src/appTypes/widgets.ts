import { IAlertData, IGoalData, IStatData, IStaticFile } from "types";
import { IFileInfo } from "./files";

export type AlignText = "left" | "center" | "right";

export interface IFont {
  name: string;
  link: string;
}

// goals
export interface IWidgetGoalData extends IGoalData<IFont> {}

// // stats
export interface IWidgetStatData extends IStatData<IFont> {}

// alert
export interface IAlert extends IAlertData<IFont, IFileInfo, IStaticFile> {}
