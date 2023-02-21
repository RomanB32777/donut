import { createApi } from "@reduxjs/toolkit/query/react";
import { donatAssetTypes, IEditUserInfo, IShortUserData, IUser } from "types";
import { setFormDataValues } from "utils";
import { baseQuery } from "./utils";
import { IDataWithFile } from "appTypes";

interface IEditCreatorImage extends IDataWithFile {
  fileType: donatAssetTypes;
}

const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQuery({
    apiURL: "api/user",
  }),
  tagTypes: ["user"],
  endpoints: (build) => ({
    getUser: build.query<IUser, string>({
      query: (address) => `/${address}`,
      providesTags: ["user"],
    }),

    getCreatorInfo: build.query<IUser, string>({
      query: (username) => `/creators/${username}`,
    }),

    checkIsExistUser: build.query<boolean, string>({
      query: (addressOrUsername) => `/check-user-exist/${addressOrUsername}`,
    }),

    registerUser: build.mutation<IUser, IShortUserData>({
      query: (userInfo) => ({
        url: `/`,
        method: "POST",
        params: { isVisibleNotification: false },
        body: userInfo,
      }),
      invalidatesTags: ["user"],
      extraOptions: {},
    }),

    editUser: build.mutation<IUser, IEditUserInfo>({
      query: (userInfo) => ({
        url: "/",
        method: "PUT",
        body: userInfo,
      }),
      invalidatesTags: ["user"],
    }),

    editUserAvatar: build.mutation<null, IDataWithFile>({
      query: (avatarInfo) => {
        const formData = new FormData();
        setFormDataValues({ formData, dataValues: avatarInfo });

        return {
          url: "/edit-image",
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["user"],
    }),

    editCreatorImage: build.mutation<void, IEditCreatorImage>({
      query: ({ fileType, ...imageInfo }) => {
        const formData = new FormData();
        setFormDataValues({ formData, dataValues: imageInfo });

        return {
          url: `/edit-creator-image/${fileType}`,
          method: "PUT",
          body: formData,
        };
      },
      // invalidatesTags: ["user"],
    }),

    deleteUser: build.mutation<IUser, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetCreatorInfoQuery,
  useCheckIsExistUserQuery,
  useLazyCheckIsExistUserQuery,
  useLazyGetCreatorInfoQuery,
  useLazyGetUserQuery,
  useRegisterUserMutation,
  useEditUserMutation,
  useEditUserAvatarMutation,
  useEditCreatorImageMutation,
  useDeleteUserMutation,
} = userApi;
export default userApi;
