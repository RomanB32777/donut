import { periodItemsTypes } from 'types/index.js';

enum HttpCode {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

interface AppError extends Error {
  status: HttpCode;
}

type additionalPeriodItems = 'yesterday' | 'all' | 'custom';

type fullPeriodItems = periodItemsTypes & additionalPeriodItems;

type IFullFilterPeriodItems<T = string> = {
  [key in fullPeriodItems]: T;
};

export type { HttpCode, AppError, fullPeriodItems, IFullFilterPeriodItems };
