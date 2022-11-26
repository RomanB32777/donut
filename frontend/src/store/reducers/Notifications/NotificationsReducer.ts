import { SET_NOTIF, SET_UPDATE_FLAG } from "../../types/Notifications";

// const initialState: any[] = [];
const initialState: { list: any[]; shouldUpdateApp: boolean } = {
  list: [],
  shouldUpdateApp: true,
};

const NotificationsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_NOTIF:
      return { ...state, ...action.payload };

    case SET_UPDATE_FLAG:
      return { ...state, shouldUpdateApp: action.payload };

    default:
      return state;
  }
};

export default NotificationsReducer;
