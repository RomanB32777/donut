import { createApi } from "@reduxjs/toolkit/query/react";
import {
  INotification,
  INotificationChangeStatus,
  INotificationDelete,
} from "types";
import { serviceStatusHandler } from "./utils";
import { INotificationParams } from "appTypes";

const notificationsApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: serviceStatusHandler({
    apiURL: "api/notification",
  }),
  refetchOnFocus: true,
  tagTypes: ["notifications"],
  endpoints: (build) => ({
    getNotifications: build.query<INotification[], INotificationParams>({
      query: ({ user, shouldUpdateApp, ...query }) => ({
        url: `/${user}`,
        params: query,
      }),
      providesTags: ["notifications"],
    }),

    setStatusNotification: build.mutation<
      INotification,
      INotificationChangeStatus
    >({
      query: (notificationInfo) => ({
        url: "/status",
        method: "PUT",
        params: { isVisibleNotification: false },
        body: notificationInfo,
      }),
      invalidatesTags: ["notifications"],
    }),

    deleteNotification: build.mutation<INotification, INotificationDelete>({
      query: ({ id, userID }) => ({
        url: `/${id}/${userID}`,
        params: { isVisibleNotification: false },
        method: "DELETE",
      }),
      invalidatesTags: ["notifications"],
    }),

    deleteAll: build.mutation<[], number>({
      query: (userID) => ({
        url: `/${userID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useLazyGetNotificationsQuery,
  useSetStatusNotificationMutation,
  useDeleteNotificationMutation,
  useDeleteAllMutation,
} = notificationsApi;

export default notificationsApi;
