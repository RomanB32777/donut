import { createApi } from "@reduxjs/toolkit/query/react";
import { defaultAssetsFolders, ISoundInfo } from "types";
import { serviceStatusHandler } from "./utils";

const filesApi = createApi({
  reducerPath: "filesApi",
  baseQuery: serviceStatusHandler({
    apiURL: "api/file",
  }),
  endpoints: (build) => ({
    getDefaultImages: build.query<string[], defaultAssetsFolders>({
      query: (type) => `/default-images/${type}`,
    }),

    getSounds: build.query<ISoundInfo[], string>({
      query: (username) => `/sounds/${username}`,
    }),
  }),
});

export const {
  useGetDefaultImagesQuery,
  useLazyGetDefaultImagesQuery,
  useGetSoundsQuery,
  useLazyGetSoundsQuery,
} = filesApi;

export default filesApi;
