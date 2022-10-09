// period-time
type periodItemsTypes = "today" | "7days" | "30days" | "year";

type IFilterPeriodItems = {
  [key in periodItemsTypes]: string;
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
  IFilterPeriodItems,
  currentPeriodItemsTypes,
  allPeriodItemsTypes,
  IFilterCurrentPeriodItems,
  statsDataTypes,
  IStatsDataType,
};
