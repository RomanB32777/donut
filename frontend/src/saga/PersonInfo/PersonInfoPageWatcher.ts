import { call, put, takeEvery } from "redux-saga/effects";
import { baseURL } from "../../axiosClient";
import { setLoading } from "../../store/types/Loading";
import { GET_PERSON_INFO_PAGE, setPersonInfoPageData } from "../../store/types/PersonInfo";

const getPersonInfoPage = async (data: {page: string, username: string}) => {
    const res = await fetch(
        baseURL + `/api/user/get-person-info-${data.page}/${data.username}/`
    )
    if (res.status === 200) {
        const result = await res.json()
        return result
    } else {
        return null
    }
}

function* PersonInfoPageWorker(action: any): any {
    yield put(setLoading(true))
    const data: any = yield call(getPersonInfoPage, action.payload)
    if (data) {
        yield put(setPersonInfoPageData({page: action.payload.page, data: data}))
    }
    yield put(setLoading(false))

}

export function* PersonInfoPageWatcher() {
    yield takeEvery(GET_PERSON_INFO_PAGE, PersonInfoPageWorker)
}