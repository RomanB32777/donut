import { createApi } from "@reduxjs/toolkit/query/react";
import {
  IEditGoalData,
  IGoalData,
  IGoalDataBase,
  IWidgetQueryData,
} from "types";
import { baseQuery } from "./utils";
import { IVisibleNotification } from "appTypes";

interface IGoalEditData extends IEditGoalData, IVisibleNotification {}

const goalsApi = createApi({
  reducerPath: "goalsApi",
  baseQuery: baseQuery({
    apiURL: "api/widgets/goals",
  }),
  tagTypes: ["goals"],
  endpoints: (build) => ({
    getGoals: build.query<
      IGoalData[],
      { userId: string } & Partial<Pick<IGoalData, "isArchive">>
    >({
      query: ({ userId, isArchive }) => ({
        url: `/${userId}`,
        params: { isArchive },
      }),
      providesTags: ["goals"],
    }),

    getGoalsWidgetData: build.query<IGoalData, IWidgetQueryData>({
      query: ({ username, id }) => `${username}/${id}`,
      providesTags: ["goals"],
    }),

    createGoal: build.mutation<IGoalData, IGoalDataBase>({
      query: (goalInfo) => ({
        url: "/",
        method: "POST",
        body: goalInfo,
      }),
      invalidatesTags: ["goals"],
    }),

    editGoal: build.mutation<IGoalData, IGoalEditData>({
      query: ({ isVisibleNotification, id, ...goalInfo }) => ({
        url: `/${id}`,
        method: "PATCH",
        params: { isVisibleNotification },
        body: goalInfo,
      }),
      invalidatesTags: ["goals"],
    }),

    deleteGoal: build.mutation<IGoalData, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["goals"],
    }),
  }),
});

export const {
  useGetGoalsQuery,
  useLazyGetGoalsQuery,
  useGetGoalsWidgetDataQuery,
  useLazyGetGoalsWidgetDataQuery,
  useCreateGoalMutation,
  useEditGoalMutation,
  useDeleteGoalMutation,
} = goalsApi;

export default goalsApi;
