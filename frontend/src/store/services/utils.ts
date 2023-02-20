import { Middleware, MiddlewareAPI } from "redux";
import { FetchArgs, fetchBaseQuery, retry } from "@reduxjs/toolkit/dist/query";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import { addErrorNotification, addSuccessNotification } from "utils";
import { baseURL } from "consts";

const getQueryArgs = (args: string | FetchArgs) => {
  const fetchArgs = args as FetchArgs;
  const isGetMethod = !fetchArgs.method;
  const isExistParams = Boolean(fetchArgs.params);

  if (typeof args === "string" || isGetMethod) return args;

  if (isExistParams) {
    const { params, ...queryArgs } = args;
    return queryArgs;
  }
  return args;
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

const serviceStatusHandler = ({ apiURL }: { apiURL: string }) =>
  retry(
    async (args: string | FetchArgs, api, extraOptions) => {
      const queryArgs = getQueryArgs(args);
      const result = await fetchBaseQuery({
        baseUrl: `${baseURL}/${apiURL}`,
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

      if (result.error?.status) retry.fail(result.error);
      return result;
    },
    {
      maxRetries: 5,
    }
  );

export { getQueryArgs, rtkQueryErrorLogger, serviceStatusHandler };
