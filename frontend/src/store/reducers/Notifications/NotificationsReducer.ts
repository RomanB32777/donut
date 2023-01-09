import {
  INotificationsAction,
  INotificationsState,
} from "../../../appTypes/notifications";
import { SET_NOTIF, SET_UPDATE_FLAG } from "../../types/Notifications";

const initialState: INotificationsState = {
  list: [],
  shouldUpdateApp: true,
};

const NotificationsReducer = (
  state = initialState,
  action: INotificationsAction
) => {
  switch (action.type) {
    case SET_NOTIF:
      return { ...state, list: [...state.list, ...action.payload.list] };

    case SET_UPDATE_FLAG:
      return { ...state, shouldUpdateApp: action.payload.shouldUpdateApp };

    default:
      return state;
  }
};

export default NotificationsReducer;
