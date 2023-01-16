import {
  INotificationParams,
  INotificationsState,
} from "appTypes/notifications";

const SET_NOTIF = "SET_NOTIF";
const SET_UPDATE_FLAG = "SET_UPDATE_FLAG";
const GET_NOTIF = "GET_NOTIF";

const setNotifications = (payload: INotificationsState) => ({
  type: SET_NOTIF,
  payload,
});

const setUpdateAppNotifications = (shouldUpdateApp: boolean) => ({
  type: SET_UPDATE_FLAG,
  payload: { shouldUpdateApp },
});

const getNotifications = ({
  user,
  shouldUpdateApp = true,
  spam_filter = false,
  ...queries
}: INotificationParams) => ({
  type: GET_NOTIF,
  payload: { user, shouldUpdateApp, spam_filter, ...queries },
});

export {
  SET_NOTIF,
  SET_UPDATE_FLAG,
  GET_NOTIF,
  setNotifications,
  setUpdateAppNotifications,
  getNotifications,
};
