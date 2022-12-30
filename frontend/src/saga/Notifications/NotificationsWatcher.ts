import { GET_NOTIF } from "./../../store/types/Notifications/index";
import { call, put, takeEvery } from "redux-saga/effects";
import axiosClient from "../../axiosClient";
import { setLoading } from "../../store/types/Loading";
import { setNotifications } from "../../store/types/Notifications";

const asyncGetNotifications = async (user: number | string) => {
  const { status, data } = await axiosClient.get(`/api/notification/${user}`);
  // ?blockchain=${currBlockchain.name}
  if (status === 200) return data;
  return null;
};

function* NotificationsWorker(action: any): any {
  yield put(setLoading(true));
  const data: any = yield call(asyncGetNotifications, action.payload.user);
  if (data) {
    // const notifications = yield select((state: any) => state.notifications);
    // if (data.notifications.length > notifications.length)
    yield put(
      setNotifications({
        list: data.notifications,
        shouldUpdateApp: action.payload.shouldUpdateApp,
      })
    );
  }
  yield put(setLoading(false));
}

export function* NotificationsWatcher() {
  yield takeEvery(GET_NOTIF, NotificationsWorker);
}
