import { call, put, takeEvery } from "redux-saga/effects";
import { baseURL } from "../../axiosClient";
import { setLoading } from "../../store/types/Loading";
import { setUser, TRY_TO_GET_USER } from "../../store/types/User";

const asyncGetUser = async (token: string) => {
    const response = await fetch( baseURL + '/api/user/'+ token)
    if (response.status === 200) {
        const result = await response.json()
        return result
    }
}

function* UserWorker(action: any): any {
    yield put(setLoading(true))
    const data: any = yield call(asyncGetUser, action.payload)
    if (data) {
        yield put(setUser(data))
    }
    yield put(setLoading(false))
}

export function* UserWatcher() {
    yield takeEvery(TRY_TO_GET_USER, UserWorker)
}