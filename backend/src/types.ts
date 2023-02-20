/* eslint-disable @typescript-eslint/no-empty-interface */
import { allPeriodItemsTypes, ISendingDataWithFile } from 'types';

enum HttpCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

interface AppError extends Error {
  status: HttpCode;
}

interface RequestParams {}

interface ResponseBody {}

interface RequestBody {}

interface RequestQuery {}

interface RequestUserIDParam {
  user_id: number;
}

type RequestBodyWithFile<T = Record<string, string>> = T & ISendingDataWithFile<T>;

type IFullFilterPeriodItems<T = string> = {
  [key in allPeriodItemsTypes]: T;
};

export { HttpCode };

export type {
  AppError,
  RequestParams,
  ResponseBody,
  RequestBody,
  RequestQuery,
  RequestUserIDParam,
  RequestBodyWithFile,
  IFullFilterPeriodItems,
};
