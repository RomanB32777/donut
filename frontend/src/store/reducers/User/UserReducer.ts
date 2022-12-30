import { IUser } from "types";
import { IUserAction } from "../../../types";
import { SET_USER } from "../../types/User";

const initialState: IUser = {
  id: 0,
  username: "",
  roleplay: "creators",
  wallet_address: "",
  avatar: "",
  created_at: "",
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

const UserReducer = (state = initialState, action: IUserAction) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

export default UserReducer;
