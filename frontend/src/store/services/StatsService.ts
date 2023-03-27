import { createApi } from "@reduxjs/toolkit/query/react";
import { IEditStatData, IStatData, IStatDataBase } from "types";
import { baseQuery } from "./utils";

const statsApi = createApi({
  reducerPath: "statsApi",
  baseQuery: baseQuery({
    apiURL: "api/widgets/stats",
  }),
  tagTypes: ["stats"],
  endpoints: (build) => ({
    getStats: build.query<IStatData[], void>({
      query: () => "/",
      providesTags: ["stats"],
    }),

    getStatsWidgetData: build.query<IStatData, string>({
      query: (id) => `/${id}`,
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
      query: ({ id, ...statInfo }) => ({
        url: `/${id}`,
        method: "PATCH",
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
