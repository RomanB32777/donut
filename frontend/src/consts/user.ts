import {
  IAuthToken,
  IWebToken,
  IDonatPageWithFiles,
  IFileInfo,
  IUserWithFiles,
} from "appTypes";
import { IShortUserData, IUser } from "types";

const initFileInfo: IFileInfo = {
  preview: "",
  file: null,
};

const initUser: IUser = {
  id: "",
  username: "",
  roleplay: "creators",
  walletAddress: "",
  avatarLink: "",
  createdAt: new Date(),
  email: "",
  status: "confirmation",
};

const initDonatPage: IDonatPageWithFiles = {
  headerBanner: initFileInfo,
  backgroundBanner: initFileInfo,
  welcomeText: "",
  btnText: "",
  mainColor: "",
  backgroundColor: "",
};

const initUserWithFiles: IUserWithFiles = {
  id: "",
  username: "",
  roleplay: "creators",
  walletAddress: "",
  avatarLink: initFileInfo,
  createdAt: new Date(),
  email: "",
  status: "confirmation",
};

const shortUserInfo: IShortUserData = {
  id: "",
  username: "",
  walletAddress: "",
  roleplay: "backers",
};

const initAuthToken: IAuthToken = {
  access_token: "",
};

const initWebToken: IWebToken = {
  web_token: "",
};

export {
  initFileInfo,
  initUser,
  initDonatPage,
  initUserWithFiles,
  shortUserInfo,
  initAuthToken,
  initWebToken,
};
