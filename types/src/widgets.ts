import { allPeriodItemsTypes } from "./dates";
import { IResetField } from "./general";
import { gendersType } from "./user";

interface IWidgetQueryData {
  username: string;
  id: string;
}

interface IGoalDataBase {
  title: string;
  amountGoal: number;
  creator: string;
}

interface IGoalWidgetData<FontType = string> {
  titleColor: string;
  titleFont: FontType;
  progressColor: string;
  progressFont: FontType;
  backgroundColor: string;
}

interface IGoalData<FontType = string>
  extends IGoalDataBase,
    IGoalWidgetData<FontType> {
  id: string;
  amountRaised: number;
  isArchive: boolean;
}

interface IEditGoalData
  extends Partial<Omit<IGoalData, "creator" | "amountRaised" | "isArchive">>,
    IResetField {
  id: string;
}

type goalDataKeys = keyof IGoalData;

interface IAlertData<
  FontType = string,
  BannerType = string,
  SoundType = string
> {
  id: string;
  banner: BannerType;
  messageColor: string;
  messageFont: FontType;
  nameColor: string;
  nameFont: FontType;
  sumColor: string;
  sumFont: FontType;
  duration: number;
  sound: SoundType;
  voice: boolean;
  genderVoice: gendersType;
  creator: string;
}

interface IGenerateSoundQuery extends Pick<IAlertData, "genderVoice"> {
  text: string;
}

interface IEditAlertData
  extends Partial<Omit<IAlertData, "creator">>,
    IResetField {
  id: string;
}

// stats-data
enum TextAlignment {
  Left = "Left",
  Center = "Center",
  Right = "Right",
}
type typeAlignment = keyof typeof TextAlignment;

enum StatsDataTypes {
  "top-donations" = "top-donations",
  "latest-donations" = "latest-donations",
  "top-supporters" = "top-supporters",
}

type statsDataTypes = keyof typeof StatsDataTypes;

interface IStatDataBase {
  title: string;
  description: string;
  template: string | string[];
  dataType: statsDataTypes;
  timePeriod: allPeriodItemsTypes;
  customTimePeriod?: string;
  creator: string;
}

interface IStatWidgetData<FontType = string> {
  titleColor: string;
  titleFont: FontType;
  barColor: string;
  contentColor: string;
  contentFont: FontType;
  textAlignment: typeAlignment;
}

interface IStatData<FontType = string>
  extends IStatDataBase,
    IStatWidgetData<FontType> {
  id: string;
}

interface IEditStatData
  extends Partial<Omit<IStatData, "creator">>,
    IResetField {
  id: string;
}

type statsDataKeys = keyof IStatData;

export { TextAlignment, StatsDataTypes };

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
  IGenerateSoundQuery,
  IEditAlertData,

  // stats
  typeAlignment,
  statsDataTypes,
  IStatDataBase,
  IStatWidgetData,
  IStatData,
  IEditStatData,
  statsDataKeys,
};
