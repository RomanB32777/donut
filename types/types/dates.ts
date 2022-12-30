type periodItemsTypes = "today" | "7days" | "30days" | "year";

type IFilterPeriodItems<T = string> = {
  [key in periodItemsTypes]: T;
};

type stringFormatTypes = "Today" | "Last 7 days" | "Last 30 days" | "This year";

// period-current-time
type currentPeriodItemsTypes = "yesterday" | "all" | "custom";

type allPeriodItemsTypes = periodItemsTypes | currentPeriodItemsTypes;

type ICurrentPeriodItemsTypes = {
  [key in allPeriodItemsTypes]: string;
};

export type {
  periodItemsTypes,
  stringFormatTypes,
  currentPeriodItemsTypes,
  allPeriodItemsTypes,
  IFilterPeriodItems,
  ICurrentPeriodItemsTypes,
};
