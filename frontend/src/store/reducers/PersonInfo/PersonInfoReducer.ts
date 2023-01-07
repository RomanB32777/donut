import { initUser } from "consts";
import { IUserAction } from "appTypes";
import { SET_MAIN_PERSON_INFO } from "../../types/PersonInfo";

const PersonInfoReducer = (state = initUser, action: IUserAction) => {
  switch (action.type) {
    case SET_MAIN_PERSON_INFO:
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

export default PersonInfoReducer;

