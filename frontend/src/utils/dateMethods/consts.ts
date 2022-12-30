import {
  ICurrentPeriodItemsTypes,
  IFilterPeriodItems,
  IStatsDataType,
  stringFormatTypes,
} from "types";

export const filterPeriodItems: IFilterPeriodItems<stringFormatTypes> = {
  today: "Today",
  "7days": "Last 7 days",
  "30days": "Last 30 days",
  year: "This year",
};

export const filterCurrentPeriodItems: ICurrentPeriodItemsTypes = {
  yesterday: "Yesterday",
  today: "Today",
  "7days": "Last 7 days",
  "30days": "Last 30 days",
  year: "Current year",
  all: "All time",
  custom: "Custom date",
};

export const filterDataTypeItems: IStatsDataType = {
  "top-donations": "Top donations",
  "latest-donations": "Recent donations",
  "top-supporters": "Top supporters",
};
