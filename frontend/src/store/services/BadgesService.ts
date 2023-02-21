import { createApi } from "@reduxjs/toolkit/query/react";
import {
  IBadgeCreatingInfo,
  IBadgeInfo,
  IBadgeQueryData,
  IBagdeAssignInfo,
  IQueryPriceParams,
  IShortUserData,
} from "types";
import { setFormDataValues } from "utils";
import { baseQuery } from "./utils";
import { IDataWithFile } from "appTypes";

const badgesApi = createApi({
  reducerPath: "badgesApi",
  baseQuery: baseQuery({
    apiURL: "api/badge",
  }),
  tagTypes: ["badges", "holders"],
  endpoints: (build) => ({
    getBadges: build.query<IBadgeInfo[], string>({
      query: (wallet_address) => `/${wallet_address}`,
      providesTags: ["badges"],
    }),

    getBadge: build.query<IBadgeInfo, IBadgeQueryData>({
      query: ({ id, wallet_address }) => `/${id}/${wallet_address}`,
      providesTags: ["badges"],
    }),

    getHolders: build.query<IShortUserData[], number>({
      query: (id) => `holders/${id}`,
      providesTags: ["badges"],
    }),

    getAssignPrice: build.query<number, IQueryPriceParams>({
      query: ({ wallet_address, token_id }) => ({
        url: "price",
        params: {
          wallet_address,
          token_id,
        },
      }),
    }),

    createBadge: build.mutation<IBadgeInfo, IDataWithFile<IBadgeCreatingInfo>>({
      query: (badgeInfo) => {
        const formData = new FormData();
        setFormDataValues({ formData, dataValues: badgeInfo });

        return {
          url: "/",
          method: "POST",
          params: { isVisibleNotification: false },
          body: formData,
        };
      },
      invalidatesTags: ["badges"],
    }),

    assignBadge: build.mutation<string, IBagdeAssignInfo>({
      query: (assignInfo) => ({
        url: "/assign-badge",
        method: "POST",
        body: assignInfo,
      }),
      invalidatesTags: ["badges"],
    }),

    deleteBadge: build.mutation<IBadgeInfo, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["badges"],
    }),
  }),
});

export const {
  useGetBadgesQuery,
  useLazyGetBadgesQuery,
  useGetBadgeQuery,
  useLazyGetBadgeQuery,
  useGetHoldersQuery,
  useLazyGetHoldersQuery,
  useGetAssignPriceQuery,
  useLazyGetAssignPriceQuery,
  useCreateBadgeMutation,
  useDeleteBadgeMutation,
  useAssignBadgeMutation,
} = badgesApi;

export default badgesApi;
