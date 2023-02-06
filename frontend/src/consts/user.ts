import { IDonatPageWithFiles, IFileInfo, IUserWithFiles } from "appTypes";
import { IShortUserData, IUser } from "types";

const initFileInfo: IFileInfo = {
  preview: "",
  file: null,
};

const initUser: IUser = {
  id: 0,
  username: "",
  roleplay: "creators",
  wallet_address: "",
  avatar: "",
  created_at: "",
  spam_filter: false,
  donat_page: {
    header_banner: "",
    background_banner: "",
    welcome_text: "",
    btn_text: "",
    main_color: "",
    background_color: "",
    security_string: "",
  },
};

const initDonatPage: IDonatPageWithFiles = {
  header_banner: initFileInfo,
  background_banner: initFileInfo,
  welcome_text: "",
  btn_text: "",
  main_color: "",
  background_color: "",
  security_string: "",
};

const initUserWithFiles: IUserWithFiles = {
  id: 0,
  username: "",
  roleplay: "creators",
  wallet_address: "",
  avatar: initFileInfo,
  created_at: "",
  spam_filter: false,
  donat_page: initDonatPage,
};

const shortUserInfo: IShortUserData = {
  id: 0,
  username: "",
  wallet_address: "",
  roleplay: "backers",
};

export { initFileInfo, initUser, initDonatPage, initUserWithFiles, shortUserInfo };
