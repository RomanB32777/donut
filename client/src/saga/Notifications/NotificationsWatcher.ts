import { GET_NOTIF } from './../../store/types/Notifications/index';
import { call, put, takeEvery } from "redux-saga/effects";
import { baseURL } from "../../axiosClient";
import { setLoading } from "../../store/types/Loading";
import {setNotifications} from "../../store/types/Notifications"

const asyncGetNotifications = async (user: number | string) => {
    const response = await fetch( baseURL + '/api/user/notifications/' + user)
    if (response.status === 200) {
        const result = await response.json()
        return result
    }
}

function* NotificationsWorker(action: any): any {
    yield put(setLoading(true))
    const data: any = yield call(asyncGetNotifications, action.payload)
    if (data) {
        yield put(setNotifications(data.notifications))
    }
    yield put(setLoading(false))
}

export function* NotificationsWatcher() {
    yield takeEvery(GET_NOTIF, NotificationsWorker)
}