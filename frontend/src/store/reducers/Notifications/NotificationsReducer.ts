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
      const { list, shouldUpdateApp } = action.payload;
      return {
        list: [...state.list, ...list],
        shouldUpdateApp,
      };

    case SET_UPDATE_FLAG:
      return { ...state, shouldUpdateApp: action.payload.shouldUpdateApp };

    default:
      return state;
  }
};

export default NotificationsReducer;
