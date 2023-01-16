type userRoles = "creators" | "backers";

enum BannerTypesEnum {
  header_banner = "header_banner",
  background_banner = "background_banner",
}

type bannerTypes = keyof typeof BannerTypesEnum;

interface IUserBase {
  id: number;
  username: string;
}

interface IDonatPageWithoutBanners {
  welcome_text: string;
  btn_text: string;
  main_color: string;
  background_color: string;
  security_string: string;
}

interface IEditUserData extends IUserBase, IDonatPageWithoutBanners {}

interface IShortUserData extends IUserBase {
  roleplay: userRoles;
  wallet_address: string;
}

interface IDonatPage<T = string> extends IDonatPageWithoutBanners {
  [BannerTypesEnum.header_banner]: T;
  [BannerTypesEnum.background_banner]: T;
}

interface IUser<T = string> extends IShortUserData {
  avatar: T;
  created_at: string;
  donat_page: IDonatPage<T>;
  spam_filter: boolean;
}

type userDataKeys = keyof IUser

export type {
  userRoles,
  bannerTypes,
  IUserBase,
  IDonatPageWithoutBanners,
  IEditUserData,
  IShortUserData,
  IDonatPage,
  IUser,
  userDataKeys,
};
