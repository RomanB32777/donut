import { IUser } from "types";

const initUser: IUser = {
  id: 0,
  username: "",
  roleplay: "creators",
  wallet_address: "",
  avatar: "",
  created_at: "",
  spamFilter: false,
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

export { initUser };
