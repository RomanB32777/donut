import { createApi } from "@reduxjs/toolkit/query/react";
import {
  IEditStatData,
  IStatData,
  IStatDataBase,
  IWidgetQueryData,
} from "types";
import { serviceStatusHandler } from "./utils";

const statsApi = createApi({
  reducerPath: "statsApi",
  baseQuery: serviceStatusHandler({
    apiURL: "api/widget/stats-widget",
  }),
  tagTypes: ["stats"],
  endpoints: (build) => ({
    getStats: build.query<IStatData[], number>({
      query: (user) => `/${user}`,
      providesTags: ["stats"],
    }),

    getStatsWidgetData: build.query<IStatData, IWidgetQueryData>({
      query: ({ username, id }) => `/${username}/${id}`,
    }),

    createStat: build.mutation<IStatData, IStatDataBase>({
      query: (statInfo) => ({
        url: "/",
        method: "POST",
        body: statInfo,
      }),
      invalidatesTags: ["stats"],
    }),

    editStat: build.mutation<IStatData, IEditStatData>({
      query: (statInfo) => ({
        url: "/",
        method: "PUT",
        body: statInfo,
      }),
      invalidatesTags: ["stats"],
    }),

    deleteStat: build.mutation<IStatData, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["stats"],
    }),
  }),
});

export const {
  useGetStatsQuery,
  useLazyGetStatsQuery,
  useGetStatsWidgetDataQuery,
  useLazyGetStatsWidgetDataQuery,
  useCreateStatMutation,
  useEditStatMutation,
  useDeleteStatMutation,
} = statsApi;

export default statsApi;
