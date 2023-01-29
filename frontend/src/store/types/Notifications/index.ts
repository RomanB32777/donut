import {
  INotificationParams,
  INotificationsState,
} from "appTypes/notifications";

const SET_NOTIF = "SET_NOTIF";
const ADD_NOTIF = "ADD_NOTIF";
const SET_UPDATE_FLAG = "SET_UPDATE_FLAG";
const GET_NOTIF = "GET_NOTIF";

const setNotifications = (payload: INotificationsState) => ({
  type: SET_NOTIF,
  payload,
});

const addNotification = (payload: INotificationsState) => ({
  type: ADD_NOTIF,
  payload,
});

const setUpdateAppNotifications = (shouldUpdateApp: boolean) => ({
  type: SET_UPDATE_FLAG,
  payload: { shouldUpdateApp },
});

const getNotifications = ({
  user,
  shouldUpdateApp = true,
  ...queries
}: INotificationParams) => ({
  type: GET_NOTIF,
  payload: { user, shouldUpdateApp, ...queries },
});

export {
  SET_NOTIF,
  ADD_NOTIF,
  SET_UPDATE_FLAG,
  GET_NOTIF,
  setNotifications,
  addNotification,
  setUpdateAppNotifications,
  getNotifications,
};
