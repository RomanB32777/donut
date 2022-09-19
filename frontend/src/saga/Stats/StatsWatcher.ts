import { call, put, takeEvery } from "redux-saga/effects";
import { baseURL } from "../../axiosClient";
import { setLoading } from "../../store/types/Loading";
import { GET_STATS, setStats } from "../../store/types/Stats"

const asyncGetStats = async (creator_id: string) => {
    const response = await fetch( baseURL + '/api/user/stats-widgets/'+ creator_id)
    if (response.status === 200) {
        const result = await response.json()
        return result
    }
}

function* StatsWorker(action: any): any {
    yield put(setLoading(true))
    const data: any = yield call(asyncGetStats, action.payload)
    if (data) {
        yield put(setStats(data))
    }
    yield put(setLoading(false))
}

export function* StatsWatcher() {
    yield takeEvery(GET_STATS, StatsWorker)
}