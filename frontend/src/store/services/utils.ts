import { Middleware, MiddlewareAPI } from "redux";
import { FetchArgs, fetchBaseQuery, retry } from "@reduxjs/toolkit/dist/query";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import {
  addErrorNotification,
  addSuccessNotification,
  setAuthToken,
} from "utils";
import { baseURL, storageToken } from "consts";

const getQueryArgs = ({
  args,
  isQuery,
}: {
  args: string | FetchArgs;
  isQuery: boolean;
}) => {
  if (isQuery) return args;

  const fetchArgs = args as FetchArgs;
  const { params, ...queryArgs } = fetchArgs;
  return queryArgs;
};

const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      addErrorNotification({
        message: action.payload?.data?.message || "error",
      });
    }
    return next(action);
  };

const baseQuery = ({ apiURL }: { apiURL: string }) =>
  retry(
    async (args: string | FetchArgs, api, extraOptions) => {
      const queryArgs = getQueryArgs({ args, isQuery: api.type === "query" });

      const result = await fetchBaseQuery({
        baseUrl: `${baseURL}/${apiURL}`,
        prepareHeaders: (headers) => {
          const token = localStorage.getItem(storageToken);
          if (token) headers.set("Authorization", token);
          return headers;
        },
      })(queryArgs, api, extraOptions);

      const isVisibleNotificationArg = (args as FetchArgs).params
        ?.isVisibleNotification;

      const isVisibleNotification =
        isVisibleNotificationArg === undefined
          ? true
          : isVisibleNotificationArg;

      const response = result.meta?.response;
      const request = result.meta?.request;

      if (response && request) {
        const { method } = request;
        const { status } = response;

        if ([200, 201, 204].includes(status)) {
          switch (method) {
            case "POST":
              isVisibleNotification &&
                addSuccessNotification({
                  message: "Data created successfully",
                  id: "success-post",
                });
              break;

            case "PUT":
              isVisibleNotification &&
                addSuccessNotification({
                  message: "Data saved successfully",
                  id: "success-put",
                });
              break;

            case "DELETE":
              isVisibleNotification &&
                addSuccessNotification({
                  message: "Deleted successfully",
                  id: "success-delete",
                });
              break;

            default:
              break;
          }
        }
      }

      const errorStatus = result.error?.status;

      if (errorStatus) {
        if (errorStatus === 401) await setAuthToken();
        else retry.fail(result.error);
      }

      return result;
    },
    {
      maxRetries: 5,
    }
  );

export { getQueryArgs, rtkQueryErrorLogger, baseQuery };
