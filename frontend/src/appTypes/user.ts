import { IDonatPage, IUser, IUserTokenPayload } from "types";
import { IFileInfo } from "./files";

export interface IDonatPageWithFiles extends IDonatPage<IFileInfo> {}

export type DonatPageFiellds = keyof IDonatPageWithFiles;

export interface IUserWithFiles extends IUser<IFileInfo> {}

export interface IAuthToken {
  access_token: string;
}

export interface IWebToken {
  web_token: string;
}

export interface IUserWithToken extends IUserTokenPayload, IAuthToken {}

export interface IFullUserWithToken extends IUser, IAuthToken {}
