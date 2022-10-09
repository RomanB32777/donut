import {
  IFilterCurrentPeriodItems,
  IFilterPeriodItems,
  IStatsDataType,
} from "./types";

export const filterPeriodItems: IFilterPeriodItems = {
  today: "Today",
  "7days": "Last 7 days",
  "30days": "Last 30 days",
  year: "This year",
};

export const filterCurrentPeriodItems: IFilterCurrentPeriodItems = {
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