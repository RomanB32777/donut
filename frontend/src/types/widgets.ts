import { IAlertBase, IBadgeData, IGoalData, IStatData } from "types";
import { IFileInfo } from "./files";

type AlignText = "left" | "center" | "right";

interface IFont {
  name: string;
  link: string;
}

interface IGoalAction {
  type: string;
  payload: IGoalData[];
}

interface IStatAction {
  type: string;
  payload: IStatData[];
}

interface IAlert extends IAlertBase {
  banner: IFileInfo;
  message_font: IFont;
  name_font: IFont;
  sum_font: IFont;
}

interface IBadge extends IBadgeData {
  image: IFileInfo;
}

export type { AlignText, IFont, IGoalAction, IStatAction, IAlert, IBadge };
