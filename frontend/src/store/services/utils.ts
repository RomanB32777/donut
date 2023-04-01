import { Middleware, MiddlewareAPI } from "redux";
import { FetchArgs, fetchBaseQuery, retry } from "@reduxjs/toolkit/dist/query";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import {
  addErrorNotification,
  addSuccessNotification,
  getAuthToken,
  getWebToken,
  removeAuthToken,
  removeWebToken,
} from "utils";
import { baseURL } from "consts";

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
      const message = action.payload?.data?.message || "error";
      const messages = Array.isArray(message) && message.join(", ");

      addErrorNotification({
        message: messages || message,
      });
    }
    return next(action);
  };

const baseQuery = ({
  apiURL,
  isVisibleAllNotification = true,
}: {
  apiURL: string;
  isVisibleAllNotification?: boolean;
}) =>
  retry(
    async (args: string | FetchArgs, api, extraOptions) => {
      const queryArgs = getQueryArgs({ args, isQuery: api.type === "query" });

      const result = await fetchBaseQuery({
        baseUrl: `${baseURL}/${apiURL}`,
        prepareHeaders: (headers) => {
          const token = getAuthToken();
          if (token) {
            headers.set("Authorization", `Bearer ${token}`);
          } else {
            const webToken = getWebToken();
            webToken && headers.set("Authorization", webToken);
          }
          return headers;
        },
      })(queryArgs, api, extraOptions);

      let isVisibleNotification = isVisibleAllNotification;

      const isVisibleNotificationArg = (args as FetchArgs).params
        ?.isVisibleNotification;

      if (isVisibleNotificationArg !== undefined)
        isVisibleNotification = isVisibleNotificationArg;

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

            case "PATCH":
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
        if (errorStatus === 401) {
          // TODO ???
          removeWebToken();
          removeAuthToken();
          api.dispatch({ type: "user/logoutUser" });
          api.dispatch({ type: "loading/setLoading", payload: false });
        }
        retry.fail(result.error);
      }

      return result;
    },
    {
      maxRetries: 5,
    }
  );

export { getQueryArgs, rtkQueryErrorLogger, baseQuery };
