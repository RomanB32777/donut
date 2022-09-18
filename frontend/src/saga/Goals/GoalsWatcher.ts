import { call, put, takeEvery } from "redux-saga/effects";
import { baseURL } from "../../axiosClient";
import { setLoading } from "../../store/types/Loading";
import { GET_GOALS, setGoals } from "../../store/types/Goals"

const asyncGetGoals = async (creator_id: string) => {
    const response = await fetch( baseURL + '/api/user/goals-widgets/'+ creator_id)
    if (response.status === 200) {
        const result = await response.json()
        return result
    }
}

function* GoalsWorker(action: any): any {
    yield put(setLoading(true))
    const data: any = yield call(asyncGetGoals, action.payload)
    if (data) {
        yield put(setGoals(data))
    }
    yield put(setLoading(false))
}

export function* GoalsWatcher() {
    yield takeEvery(GET_GOALS, GoalsWorker)
}