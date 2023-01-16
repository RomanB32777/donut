import { initUser } from "consts";
import { IUserAction } from "appTypes";
import { SET_USER } from "store/types/User";

const UserReducer = (state = initUser, action: IUserAction) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

export default UserReducer;
