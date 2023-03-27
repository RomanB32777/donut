import { statsDataTypes } from "types";

export type stringFormatDataTypes =
  | "filter_top_donations"
  | "filter_recent_donations"
  | "filter_top_supporters";

export type stringFormatTypes =
  | "filter_today"
  | "filter_7days"
  | "filter_month"
  | "filter_year";

export type stringAllFormatTypes =
  | stringFormatTypes
  | "filter_yesterday"
  | "filter_current_year"
  | "filter_all_time"
  | "filter_custom";

export type IStatsDataType = Record<statsDataTypes, stringFormatDataTypes>;
