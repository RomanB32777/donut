import { SET_MAIN_PERSON_INFO } from "../../types/PersonInfo";

const initialState: any = {
  main_info: {
    username: "",
    created_at: "",
    person_name: "",
    avatar: "",
    header_banner: "",
    background_banner: "",
  },
};

const PersonInfoReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_MAIN_PERSON_INFO:
      return {
        ...state,
        main_info: action.payload,
      };

    default:
      return state;
  }
};

export default PersonInfoReducer;
