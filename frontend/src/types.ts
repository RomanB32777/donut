import { allPeriodItemsTypes, statsDataTypes } from "./consts";

export declare type roleUser = "creators" | "backers";

export interface IFileInfo {
    preview: string;
    file: File | null;
}

export interface IBadgeData {
  id: number;
  creator_id: number;
  image: IFileInfo;
  title: string;
  description: string;
  blockchain: string;
  contract_address: string;
  quantity: number;
  URI?: string;
  contributor_user_id_list?: string;
}

export const initBadgeData: IBadgeData = {
  id: 0,
  creator_id: 0,
  image: {
    preview: "",
    file: null,
  },
  title: "",
  description: "",
  blockchain: "",
  URI: "",
  contract_address: "",
  quantity: 0,
}

export interface IGoalData {
  id: number;
  title: string;
  amount_goal: number;
  amount_raised: number;
  isarchive: boolean;
  title_color: string;
  progress_color: string;
  background_color: string;
  creator_id: string;
}

export interface IAlertData {
  banner: IFileInfo;
  message_color: string;
  name_color: string;
  sum_color: string;
  duration: number;
  sound: any;
  voice: boolean;
}

export const initAlertData: IAlertData = {
  banner: {
    preview: "",
    file: null,
  },
  message_color: "#ffffff",
  name_color: "#ffffff",
  sum_color: "#ffffff",
  duration: 15,
  sound: "sound_1",
  voice: false,
}

export declare type typeAligmnet = "Left" | "Center" | "Right";

export interface IStatData {
  id: number;
  title: string;
  stat_description: string;
  template: string[];
  data_type: statsDataTypes;
  time_period: allPeriodItemsTypes;
  title_color: string;
  bar_color: string;
  content_color: string;
  aligment: typeAligmnet;
}

export declare type AlignText = "left" | "center" | "right";

export const alignItemsList: { [key in typeAligmnet]: string } = {
  Left: "start",
  Center: "center",
  Right: "end",
};

export const alignFlextItemsList: { [key in typeAligmnet]: string } = {
  Left: "flex-start",
  Center: "center",
  Right: "flex-end",
};

export interface IBadge {
  id: number;
  contract_address: string;
  creator_id: number;
  contributor_user_id_list?: string;
}

export type typesTabContent = "all" | "settings" | "preview";