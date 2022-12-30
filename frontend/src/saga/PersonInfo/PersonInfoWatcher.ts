import axiosClient from "../../axiosClient";
import { fork, call, put, takeEvery } from "redux-saga/effects";
import {
  setMainPersonInfo,
  TRY_TO_GET_PERSON_INFO,
} from "../../store/types/PersonInfo";
import { setLoading } from "../../store/types/Loading";

const asyncGetMainData = async (username: any) => {
  try {
    const { status, data } = await axiosClient.get(
      `/api/user/creators/${username}`
    );
    if (status === 200 && !data.error) return data;
    return null;
  } catch (error) {
    return { error: true };
  }
};

function* MainDataWorker(username: any): any {
  yield put(setLoading(true));
  const data: any = yield call(asyncGetMainData, username);
  yield put(setMainPersonInfo(data));
  yield put(setLoading(false));
}

function* PersonInfoWorker(action: { type: string; payload: any }): any {
  let { id, username } = action.payload;
  if (id || username) {
    yield fork(MainDataWorker, username);
  }
}

export function* PersonInfoWatcher() {
  yield takeEvery(TRY_TO_GET_PERSON_INFO, PersonInfoWorker);
}
