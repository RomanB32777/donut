import { allPeriodItemsTypes } from "./dates";

interface IWidgetQueryData {
  username: string;
  id: string;
}

interface IGoalDataBase {
  title: string;
  amount_goal: number;
  creator_id: number;
}

interface IGoalWidgetData<FontType = string> {
  title_color: string;
  title_font: FontType;
  progress_color: string;
  progress_font: FontType;
  background_color: string;
}

interface IGoalData<FontType = string>
  extends IGoalDataBase,
    IGoalWidgetData<FontType> {
  id: string;
  amount_raised: number;
  is_archive: boolean;
}

interface IEditGoalData {
  id: string;
  goalData?: IGoalDataBase | IGoalWidgetData;
  creator_id?: number;
  isReset?: boolean;
  donat?: number;
}

type goalDataKeys = keyof IGoalData;

interface IAlertData<
  FontType = string,
  BannerType = string,
  SoundType = string
> {
  id: string;
  banner: BannerType;
  message_color: string;
  message_font: FontType;
  name_color: string;
  name_font: FontType;
  sum_color: string;
  sum_font: FontType;
  duration: number;
  sound: SoundType;
  voice: boolean;
  gender_voice: string;
  creator_id: number;
}

interface IEditAlertData {
  id: string;
  alertData: string; // JSON stringify IAlertData object
  username: string;
  creator_id: number;
  isReset?: boolean;
  filelink?: string;
}

// stats-data
type typeAligmnet = "Left" | "Center" | "Right";

type statsDataTypes = "top-donations" | "latest-donations" | "top-supporters";

type IStatsDataType = {
  [key in statsDataTypes]: string;
};

interface IStatDataBase {
  title: string;
  stat_description: string;
  template: string | string[];
  data_type: statsDataTypes;
  time_period: allPeriodItemsTypes;
  creator_id: number;
}

interface IStatWidgetData<FontType = string> {
  title_color: string;
  title_font: FontType;
  bar_color: string;
  content_color: string;
  content_font: FontType;
  aligment: typeAligmnet;
}

interface IStatData<FontType = string>
  extends IStatDataBase,
    IStatWidgetData<FontType> {
  id: string;
}

interface IEditStatData {
  id: string;
  statData: IStatDataBase | IStatWidgetData;
  isReset?: boolean;
}

type statsDataKeys = keyof IStatData;

export type {
  IWidgetQueryData,

  // goals
  IGoalDataBase,
  IGoalWidgetData,
  IGoalData,
  IEditGoalData,
  goalDataKeys,

  // alerts
  IAlertData,
  IEditAlertData,

  // stats
  typeAligmnet,
  statsDataTypes,
  IStatsDataType,
  IStatDataBase,
  IStatWidgetData,
  IStatData,
  IEditStatData,
  statsDataKeys,
};
