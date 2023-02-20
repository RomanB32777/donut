import { createApi } from "@reduxjs/toolkit/query/react";
import { IAlertData, ISoundInfo, IWidgetQueryData } from "types";
import { setFormDataValues } from "utils";
import { serviceStatusHandler } from "./utils";
import { IDataWithFile } from "appTypes";

const alertsApi = createApi({
  reducerPath: "alertsApi",
  baseQuery: serviceStatusHandler({
    apiURL: "api/widget/alerts-widget",
  }),
  tagTypes: ["alerts"],
  endpoints: (build) => ({
    getAlertWidgetData: build.query<IAlertData, IWidgetQueryData>({
      query: ({ username, id }) => `/${username}` + (id ? `/${id}` : ""),
      providesTags: ["alerts"],
    }),

    editAlertsWidget: build.mutation<IAlertData, IDataWithFile<IAlertData>>({
      query: (alertInfo) => {
        const formData = new FormData();
        setFormDataValues({
          formData,
          dataValues: alertInfo,
        });
        return {
          url: "/",
          method: "PUT",
          body: formData,
        };
      },
      // async onQueryStarted(alertInfo, { dispatch, queryFulfilled }) {
      //   if (alertInfo.username && alertInfo.data) {
      //     const patchResult = dispatch(
      //       alertsApi.util.updateQueryData(
      //         "getAlertWidgetData",
      //         { username: alertInfo.username, id: alertInfo?.data?.id },
      //         (draft) => {
      //           Object.assign(draft, alertInfo.data);
      //         }
      //       )
      //     );
      //     try {
      //       await queryFulfilled;
      //     } catch {
      //       patchResult.undo();
      //     }
      //   }
      // },

      invalidatesTags: ["alerts"],
    }),

    uploadSound: build.mutation<ISoundInfo, IDataWithFile>({
      query: (soundInfo) => {
        const formData = new FormData();
        setFormDataValues({ formData, dataValues: soundInfo });

        return {
          url: "/sound",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useGetAlertWidgetDataQuery,
  useLazyGetAlertWidgetDataQuery,
  useEditAlertsWidgetMutation,
  useUploadSoundMutation,
} = alertsApi;

export default alertsApi;
