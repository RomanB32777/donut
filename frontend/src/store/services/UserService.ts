import { createApi } from "@reduxjs/toolkit/query/react";
import {
  FileUploadTypes,
  IEditCreator,
  IShortUserData,
  IUser,
  userRoles,
} from "types";
import { setFormDataValues } from "utils";
import { baseQuery } from "./utils";

interface IEditUserInfo extends Pick<IUser, "walletAddress" | "username"> {
  [FileUploadTypes.avatar]: File | null;
}

interface IEditCreatorInfo extends IEditCreator {
  [FileUploadTypes.background]: File | null;
  [FileUploadTypes.header]: File | null;
}

const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQuery({
    apiURL: "api/users",
  }),
  tagTypes: ["users"],
  endpoints: (build) => ({
    getUser: build.query<
      IUser,
      Partial<Pick<IUser, "id" | "username" | "walletAddress" | "roleplay">>
    >({
      query: ({ roleplay, ...checkField }) => {
        const [param] = Object.entries(checkField);
        const [field, value] = param;
        return {
          url: `/${field}/${value}`,
          params: { roleplay },
        };
      },
      providesTags: ["users"],
    }),

    getCreatorInfo: build.query<IUser, string>({
      query: (username) => `/creator/${username}`,
    }),

    checkIsExistUser: build.query<false | Pick<IUser, "roleplay">, string>({
      query: (addressOrUsername) => `/exist/${addressOrUsername}`,
    }),

    checkIsExistUserRole: build.query<
      boolean,
      { role: userRoles; field: string }
    >({
      query: ({ role, field }) => `/exist/${role}/${field}`,
    }),

    getLocation: build.query<any, void>({
      query: () => "location",
    }),

    createUser: build.mutation<IUser, Omit<IShortUserData, "id">>({
      query: (userInfo) => ({
        url: "/",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["users"],
      // extraOptions: {},
    }),

    editUser: build.mutation<
      IUser,
      Partial<IEditUserInfo & { isVisibleNotification: boolean }>
    >({
      query: ({ isVisibleNotification, ...userInfo }) => {
        const formData = new FormData();
        setFormDataValues({ formData, dataValues: userInfo });
        return {
          url: "/",
          method: "PATCH",
          body: formData,
          params: { isVisibleNotification },
        };
      },
      invalidatesTags: ["users"],
    }),

    editCreator: build.mutation<IUser, Partial<IEditCreatorInfo>>({
      query: (creatorInfo) => {
        const formData = new FormData();
        setFormDataValues({ formData, dataValues: creatorInfo });
        return {
          url: "/creator",
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["users"],
    }),

    deleteUser: build.mutation<IUser, void>({
      query: () => ({
        url: "/",
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useLazyGetUserQuery,
  useGetCreatorInfoQuery,
  useCheckIsExistUserQuery,
  useCheckIsExistUserRoleQuery,
  useLazyCheckIsExistUserRoleQuery,
  useGetLocationQuery,
  useLazyGetLocationQuery,
  useLazyCheckIsExistUserQuery,
  useLazyGetCreatorInfoQuery,
  useCreateUserMutation,
  useEditUserMutation,
  useEditCreatorMutation,
  useDeleteUserMutation,
} = userApi;
export default userApi;
