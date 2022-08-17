import { GET_NOTIF } from './../../store/types/Notifications/index';
import { call, put, takeEvery } from "redux-saga/effects";
import { baseURL } from "../../axiosClient";
import { setLoading } from "../../store/types/Loading";
import {setNotifications} from "../../store/types/Notifications"

const asyncGetNotifications = async (userID: number) => {
    const response = await fetch( baseURL + '/api/user/notifications/' + userID)
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