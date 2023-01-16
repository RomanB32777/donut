import { GET_NOTIF } from "store/types/Notifications/index";
import { call, put, takeEvery } from "redux-saga/effects";

import axiosClient from "modules/axiosClient";
import { setLoading } from "store/types/Loading";
import { setNotifications } from "store/types/Notifications";
import { IAnyAction, INotificationParams } from "appTypes";

const asyncGetNotifications = async ({
  user,
  shouldUpdateApp,
  ...query
}: INotificationParams) => {
  const queryParams: Record<string, any> = { ...query };

  const queryParamsKeys = Object.keys(queryParams).filter((key) =>
    Boolean(queryParams[key])
  );

  const queryParamsValues = queryParamsKeys.length
    ? "?" + queryParamsKeys.map((key) => `${key}=${queryParams[key]}`).join("&")
    : "";

  const { status, data } = await axiosClient.get(
    `/api/notification/${user}${queryParamsValues}`
  );

  if (status === 200) return data;
  return [];
};

function* NotificationsWorker(action: IAnyAction<INotificationParams>): any {
  yield put(setLoading(true));
  const data = yield call(asyncGetNotifications, action.payload);
  if (data) {
    // const notifications = yield select((state: any) => state.notifications);
    // if (data.notifications.length > notifications.length)
    yield put(
      setNotifications({
        list: data.notifications,
        shouldUpdateApp: action.payload.shouldUpdateApp || false,
      })
    );
  }
  yield put(setLoading(false));
}

export function* NotificationsWatcher() {
  yield takeEvery(GET_NOTIF, NotificationsWorker);
}
