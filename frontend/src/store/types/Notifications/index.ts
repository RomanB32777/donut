import { INotificationsState } from "../../../types/notifications";

export const SET_NOTIF = "SET_NOTIF";
export const SET_UPDATE_FLAG = "SET_UPDATE_FLAG";
export const GET_NOTIF = "GET_NOTIF";

export const setNotifications = (payload: INotificationsState) => ({
  type: SET_NOTIF,
  payload,
});

export const setUpdateAppNotifications = (shouldUpdateApp: boolean) => ({
  type: SET_UPDATE_FLAG,
  payload: { shouldUpdateApp },
});

export const getNotifications = ({
  user,
  shouldUpdateApp = true,
}: {
  user: number | string;
  shouldUpdateApp?: boolean;
}) => ({
  type: GET_NOTIF,
  payload: { user, shouldUpdateApp },
});
