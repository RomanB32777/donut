export interface IFileInfo {
    preview: string;
    file: File | null;
}

export interface IBadgeData {
  image: IFileInfo;
  title: string;
  description: string;
  blockchain: string;
  contract_address: string;
  URI?: string;
  quantity?: number;
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
  sound: string;
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
  duration: 5,
  sound: "sound_1",
  voice: false,
}

export declare type typeAligmnet = "Left" | "Center" | "Right";

export interface IStatData {
  id: number;
  title: string;
  stat_description: string;
  template: string[];
  data_type: string;
  time_period: string;
  title_color: string;
  bar_color: string;
  content_color: string;
  aligment: typeAligmnet;
}

export const alignItemsList: { [key in typeAligmnet]: string } = {
  Left: "flex-start",
  Center: "center",
  Right: "flex-end",
};

export interface IBadge {
  id: number;
  contract_address: string;
}
