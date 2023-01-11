type userRoles = "creators" | "backers";

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

interface IDonatPage extends IDonatPageWithoutBanners {
  header_banner: string;
  background_banner: string;
}

interface IUser extends IShortUserData {
  avatar: string;
  created_at: string;
  donat_page: IDonatPage;
  spamFilter: boolean;
}

export type {
  userRoles,
  IUserBase,
  IDonatPageWithoutBanners,
  IEditUserData,
  IShortUserData,
  IDonatPage,
  IUser,
};
