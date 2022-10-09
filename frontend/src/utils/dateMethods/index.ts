import { allPeriodItemsTypes, periodItemsTypes, statsDataTypes } from "./types";
import moment from "moment";
import {
  filterCurrentPeriodItems,
  filterDataTypeItems,
  filterPeriodItems,
} from "./consts";

export const DateTimezoneFormatter = (date: string) => {
  const initDate = new Date(date);
  const formatedDate = initDate.getTime();
  const userOffset = initDate.getTimezoneOffset() * 60 * 1000;
  return new Date(formatedDate + userOffset).toISOString();
};

export const DateFormatter = (
  date: string,
  toFormat: string = "DD/MM/YYYY HH:mm"
) => {
  let dateFormat = moment(date).format(toFormat);
  if (dateFormat === "Invalid Date") dateFormat = "";
  return dateFormat;
};

// period-time
export const getTimePeriodQuery: (timePeriod: string) => periodItemsTypes = (
  timePeriod
) => {
  const findKey = Object.keys(filterPeriodItems).find(
    (key) => filterPeriodItems[key as periodItemsTypes] === timePeriod
  );
  return findKey ? (findKey as periodItemsTypes) : "7days"; // : keyof IFilterPeriodItems
};

// period-current-time
export const getCurrentTimePeriodQuery: (
  timePeriod: string
) => string = (timePeriod) => {
  const findKey = Object.keys(filterCurrentPeriodItems).find(
    (key) => key === timePeriod
  );
  return findKey ? filterCurrentPeriodItems[findKey as allPeriodItemsTypes] : "";
};

// stats-data
export const getStatsDataTypeQuery: (dataType: string) => string = ( // statsDataTypes
  dataType
) => {
  const findKey = Object.keys(filterDataTypeItems).find(
    (key) => key === dataType
  );
  return findKey ? filterDataTypeItems[findKey as statsDataTypes] : "";
};
