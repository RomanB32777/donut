import { createApi } from "@reduxjs/toolkit/query/react";
import {
  exchangeNameTypes,
  IDonation,
  IDonationsQueryData,
  IFullSendDonat,
  IShortUserData,
  statsDataTypes,
} from "types";
import { baseQuery } from "./utils";

interface IDonationsGetParams {
  userID: number;
  data_type?: statsDataTypes | "stats";
  query?: IDonationsQueryData;
}

const donationsApi = createApi({
  reducerPath: "donationsApi",
  baseQuery: baseQuery({
    apiURL: "api/donation",
  }),
  tagTypes: ["donations"],
  endpoints: (build) => ({
    getWidgetDonations: build.query<any[], IDonationsGetParams>({
      query: ({ data_type, userID, query }) => ({
        url: `widgets/${data_type}/${userID}`,
        params: query,
      }),
      providesTags: ["donations"],
    }),

    getDonationsPage: build.query<any[], IDonationsGetParams>({
      query: ({ userID, query }) => ({
        url: `page/${userID}`,
        params: query,
      }),
      providesTags: ["donations"],
    }),

    getSupporters: build.query<IShortUserData[], number>({
      query: (userID) => `supporters/${userID}`,
    }),

    getUsdKoef: build.query<number, exchangeNameTypes>({
      query: (blockchain) => ({ url: `exchange`, params: { blockchain } }),
    }),

    createDonation: build.mutation<IDonation, IFullSendDonat>({
      query: (donationInfo) => ({
        url: "/",
        method: "POST",
        params: { isVisibleNotification: false },
        body: donationInfo,
      }),
      invalidatesTags: ["donations"],
    }),
  }),
});

export const {
  useGetWidgetDonationsQuery,
  useLazyGetWidgetDonationsQuery,
  useGetDonationsPageQuery,
  useLazyGetDonationsPageQuery,
  useGetSupportersQuery,
  useLazyGetSupportersQuery,
  useCreateDonationMutation,
  useGetUsdKoefQuery,
  useLazyGetUsdKoefQuery,
} = donationsApi;

export default donationsApi;
