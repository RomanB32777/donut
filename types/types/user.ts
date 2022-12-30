type userRoles = "creators" | "backers";

interface IUserBase {
  id: number;
  username: string;
}

interface IDonatPage {
  welcome_text: string;
  btn_text: string;
  main_color: string;
  background_color: string;
  security_string: string;
}

interface IEditUserData extends IUserBase, IDonatPage {}

interface IShortUserData extends IUserBase {
  roleplay: userRoles;
  wallet_address: string;
}

interface IUser extends IShortUserData {
  avatar: string;
  created_at: string;
  donat_page: {
    header_banner: string;
    background_banner: string;
    welcome_text: string;
    btn_text: string;
    main_color: string;
    background_color: string;
    security_string: string;
  };
}

export type {
  userRoles,
  IUserBase,
  IShortUserData,
  IUser,
  IDonatPage,
  IEditUserData,
};
