import {
  format,
  parse,
  parseISO,
  addDays,
  endOfDay,
  startOfDay,
} from 'date-fns';
import { Between, MoreThanOrEqual } from 'typeorm';
import { allPeriodItemsTypes, periodItemsTypes } from 'types';

const intervals: Record<
  Exclude<allPeriodItemsTypes, 'all' | 'custom'>,
  number
> = {
  yesterday: -1,
  today: 0,
  '7days': -7,
  '30days': -30,
  year: -365,
};

const dateTruncParams: Record<periodItemsTypes, string> = {
  today: 'hour',
  '7days': 'day',
  '30days': 'day',
  year: 'month',
};

const parseStringDate = (dateString: string, dateFormat?: string): Date =>
  parse(dateString, dateFormat || 'dd/MM/yyyy', new Date());

const parseStringDateISO = (dateString: string, dateFormat?: string): Date => {
  const formatDate = format(
    parseStringDate(dateString, dateFormat),
    'yyyy-MM-dd',
  );
  const ISODate = new Date(formatDate).toISOString();
  return parseISO(ISODate);
};

const getTimePeriod = ({
  timePeriod,
  startDate,
  endDate,
}: {
  timePeriod: allPeriodItemsTypes;
  startDate?: string;
  endDate?: string;
}) => {
  if (startDate && endDate) {
    return Between(
      startOfDay(parseStringDate(startDate)),
      endOfDay(parseStringDate(endDate)),
    );
  }
  const now = new Date(new Date().toISOString());
  if (timePeriod === 'today') return MoreThanOrEqual(startOfDay(now));
  return MoreThanOrEqual(addDays(now, intervals[timePeriod]));
};

export {
  intervals,
  dateTruncParams,
  parseStringDate,
  parseStringDateISO,
  getTimePeriod,
};
