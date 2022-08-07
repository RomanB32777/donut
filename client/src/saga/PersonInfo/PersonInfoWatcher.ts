import axiosClient, { baseURL } from "../../axiosClient";
import { fork , call, put, takeEvery } from "redux-saga/effects";
import store from "../../store";
import { setMainPersonInfo, TRY_TO_GET_PERSON_INFO } from "../../store/types/PersonInfo";
import { setLoading } from "../../store/types/Loading";


const asyncGetMainData = async (username: any, id: any) => {
    console.log(store.getState())
    const res:any = await fetch(
        baseURL + '/api/user/creators/'+username+'/' + ( id ? id : 0)
    )
    const result = await res.json()
    console.log("RESULt", result);
    
    return result
}

function* MainDataWorker(username: any, id: any):any {
    yield put(setLoading(true))
    const data: any = yield call(asyncGetMainData, username, id)
    yield put(setMainPersonInfo(data))
    yield put(setLoading(false))
}


function* PersonInfoWorker(action: {type: string; payload: any}):any {
    let { id, username} = action.payload
    if (id || username) {
        yield fork(MainDataWorker, username, id)
    }
}

export function* PersonInfoWatcher() {
    yield takeEvery(TRY_TO_GET_PERSON_INFO, PersonInfoWorker)
}