import { call, put, takeEvery } from "redux-saga/effects";
import axiosClient, { baseURL } from "../../axiosClient";
import asyncQuery from "../../functions/asyncQuery";
import { setLoading } from "../../store/types/Loading";
import { setSearchCreators, TRY_TO_GET_PERSON_BY_NAME } from "../../store/types/Search";

const asyncSearch = async (name: string) => {
    const {data} = await axiosClient.get('/api/user/users/'+ name)
    if (data) {
        return data
    }
}

function* SearchWorker (action: any): any {
    yield put(setLoading(true))
    const data: any = yield call(asyncSearch, action.payload)

    if (data) {
        yield put(setSearchCreators(data))
    }
    yield put(setLoading(false))
}

export function* SearchWatcher() {
    yield takeEvery(TRY_TO_GET_PERSON_BY_NAME, SearchWorker)
}