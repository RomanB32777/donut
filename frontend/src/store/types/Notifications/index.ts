export const SET_NOTIF = "SET_NOTIF";
export const SET_UPDATE_FLAG = "SET_UPDATE_FLAG";
export const GET_NOTIF = "GET_NOTIF";

export const setNotifications = (payload: any) => ({
  type: SET_NOTIF,
  payload,
});

export const setUpdateAppNotifications = (payload: boolean) => ({
  type: SET_UPDATE_FLAG,
  payload,
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
