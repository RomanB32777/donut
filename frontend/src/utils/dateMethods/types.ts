// period-time
type periodItemsTypes = "today" | "7days" | "30days" | "year";

type stringFormatTypes = "Today" | "Last 7 days" | "Last 30 days" | "This year";

type IFilterPeriodItems<T = string> = {
  [key in periodItemsTypes]: T;
};

// period-current-time
type currentPeriodItemsTypes = "yesterday" | "all" | "custom";

type allPeriodItemsTypes = periodItemsTypes | currentPeriodItemsTypes;

type ICurrentPeriodItemsTypes = {
  [key in allPeriodItemsTypes]: string;
};

type IFilterCurrentPeriodItems = ICurrentPeriodItemsTypes;

// stats-data
type statsDataTypes = "top-donations" | "latest-donations" | "top-supporters";

type IStatsDataType = {
  [key in statsDataTypes]: string;
};

export type {
  periodItemsTypes,
  stringFormatTypes,
  IFilterPeriodItems,
  currentPeriodItemsTypes,
  allPeriodItemsTypes,
  IFilterCurrentPeriodItems,
  statsDataTypes,
  IStatsDataType,
};
