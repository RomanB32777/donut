import { GET_NOTIF } from "./../../store/types/Notifications/index";
import { call, put, takeEvery, select } from "redux-saga/effects";
import { baseURL } from "../../axiosClient";
import { setLoading } from "../../store/types/Loading";
import { setNotifications } from "../../store/types/Notifications";
import { currBlockchain } from "../../utils";

const asyncGetNotifications = async (user: number | string) => {
  const response = await fetch(
    `${baseURL}/api/user/notifications/${user}?blockchain=${currBlockchain?.nativeCurrency.symbol}`
  );
  if (response.status === 200) {
    const result = await response.json();
    return result;
  }
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
