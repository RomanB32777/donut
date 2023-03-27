import { createApi } from "@reduxjs/toolkit/query/react";
import { ILoginUser, IRegisterUser, IUser, IUserTokenPayload } from "types";
import { IAuthToken, IFullUserWithToken, IUserWithToken } from "appTypes";
import { baseQuery } from "./utils";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery({
    apiURL: "api/auth",
    isVisibleAllNotification: false,
  }),
  endpoints: (build) => ({
    login: build.mutation<IFullUserWithToken, ILoginUser>({
      query: (userInfo) => ({
        url: "/login",
        method: "POST",
        body: userInfo,
      }),
    }),

    registerUser: build.mutation<IUser, IRegisterUser>({
      query: (userInfo) => ({
        url: "/registration",
        method: "POST",
        body: userInfo,
      }),
    }),

    resetPassword: build.mutation<void, string>({
      query: (email) => ({
        url: "/reset",
        method: "POST",
        body: { email },
      }),
    }),

    resendConfirm: build.mutation<void, string>({
      query: (email) => ({
        url: "/resend",
        method: "POST",
        body: { email },
      }),
    }),

    checkToken: build.query<IUserWithToken, string>({
      query: (tokenId) => `/check/${tokenId}`,
    }),

    verifyToken: build.query<IUserTokenPayload, string>({
      query: (token) => `/verify/${token}`,
    }),

    changePassword: build.mutation<IAuthToken, string>({
      query: (password) => ({
        url: "/reset",
        method: "PATCH",
        body: { password },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterUserMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useResendConfirmMutation,
  useCheckTokenQuery,
  useLazyCheckTokenQuery,
  useVerifyTokenQuery,
  useLazyVerifyTokenQuery,
} = authApi;
export default authApi;
