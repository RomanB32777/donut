import { INotificationsState } from "appTypes/notifications";

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
}: {
  user: number | string;
  shouldUpdateApp?: boolean;
}) => ({
  type: GET_NOTIF,
  payload: { user, shouldUpdateApp },
});

export {
  SET_NOTIF,
  SET_UPDATE_FLAG,
  GET_NOTIF,
  setNotifications,
  setUpdateAppNotifications,
  getNotifications,
};
