import { ICurrentPeriodItemsTypes, IFilterPeriodItems } from "types";
import {
  IStatsDataType,
  stringAllFormatTypes,
  stringFormatTypes,
} from "appTypes";

const filterPeriodItems: IFilterPeriodItems<stringFormatTypes> = {
  today: "filter_today",
  "7days": "filter_7days",
  "30days": "filter_month",
  year: "filter_year",
};

const filterCurrentPeriodItems: ICurrentPeriodItemsTypes<stringAllFormatTypes> =
  {
    yesterday: "filter_yesterday",
    today: "filter_today",
    "7days": "filter_7days",
    "30days": "filter_month",
    year: "filter_current_year",
    all: "filter_all_time",
    custom: "filter_custom",
  };

const filterDataTypeItems: IStatsDataType = {
  "top-donations": "filter_top_donations",
  "latest-donations": "filter_recent_donations",
  "top-supporters": "filter_top_supporters",
};

export { filterPeriodItems, filterCurrentPeriodItems, filterDataTypeItems };
