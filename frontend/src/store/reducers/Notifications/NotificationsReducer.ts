import {
  INotificationsAction,
  INotificationsState,
} from "appTypes/notifications";
import {
  SET_NOTIF,
  ADD_NOTIF,
  SET_UPDATE_FLAG,
} from "store/types/Notifications";

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
      const { list: initList, shouldUpdateApp: initFlag } = action.payload;
      return {
        list: initList,
        shouldUpdateApp: initFlag,
      };

    case ADD_NOTIF:
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
