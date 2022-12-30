import { allPeriodItemsTypes } from "./dates";

interface IGoalData {
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

interface IAlertBase {
  message_color: string;
  name_color: string;
  sum_color: string;
  duration: number;
  sound: any; // ???
  voice: boolean;
  gender_voice: string;
}

interface IAlertData extends IAlertBase {
  message_font: string;
  name_font: string;
  sum_font: string;
}

// stats-data
type typeAligmnet = "Left" | "Center" | "Right";

type statsDataTypes = "top-donations" | "latest-donations" | "top-supporters";

type IStatsDataType = {
  [key in statsDataTypes]: string;
};

interface IStatData {
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

export type {
  IGoalData,
  IAlertBase,
  IAlertData,
  typeAligmnet,
  statsDataTypes,
  IStatsDataType,
  IStatData,
};
