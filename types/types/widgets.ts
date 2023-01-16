import { allPeriodItemsTypes } from "./dates";


interface IGoalWidgetData<FontType = string> {
  title_color: string;
  title_font: FontType;
  progress_color: string;
  progress_font: FontType;
  background_color: string;
}

interface IGoalData<FontType = string> extends IGoalWidgetData<FontType> {
  id: number;
  title: string;
  amount_goal: number;
  amount_raised: number;
  is_archive: boolean;
  creator_id: string;
}

type goalDataKeys = keyof IGoalData

interface IAlertData<FontType = string, BannerType = string>  {
  banner: BannerType;
  message_color: string;
  message_font: FontType;
  name_color: string;
  name_font: FontType;
  sum_color: string;
  sum_font: FontType;
  duration: number;
  sound: string;
  voice: boolean;
  gender_voice: string;
}

// stats-data
type typeAligmnet = "Left" | "Center" | "Right";

type statsDataTypes = "top-donations" | "latest-donations" | "top-supporters";

type IStatsDataType = {
  [key in statsDataTypes]: string;
};

interface IStatWidgetData<FontType = string> {
  title_color: string;
  title_font: FontType;
  bar_color: string;
  content_color: string;
  content_font: FontType;
  aligment: typeAligmnet;
}

interface IStatData<FontType = string> extends IStatWidgetData<FontType> {
  id: number;
  title: string;
  stat_description: string;
  template: string | string[];
  data_type: statsDataTypes;
  time_period: allPeriodItemsTypes;
}

export type {
  IGoalWidgetData,
  IGoalData,
  goalDataKeys,
  IAlertData,
  typeAligmnet,
  statsDataTypes,
  IStatsDataType,
  IStatWidgetData,
  IStatData,
};
