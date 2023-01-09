import request from "axios";
import axiosClient from "modules/axiosClient";
import { call, put, takeEvery } from "redux-saga/effects";
import {
  setMainPersonInfo,
  TRY_TO_GET_PERSON_INFO,
} from "store/types/PersonInfo";
import { setLoading } from "store/types/Loading";
import { addNotFoundUserNotification } from "utils";
import { IAnyAction } from "appTypes";

const asyncGetMainData = async (username: string) => {
  try {
    const { status, data } = await axiosClient.get(
      `/api/user/creators/${username}`
    );
    if (status === 200 && !data.error) return data;
    return null;
  } catch (error) {
    if (request.isAxiosError(error)) {
      const errorInfo = error.response?.data;
      addNotFoundUserNotification(errorInfo as string);
    }
    return { error: true };
  }
};

function* PersonInfoWorker(action: IAnyAction): any {
  yield put(setLoading(true));
  const data: any = yield call(asyncGetMainData, action.payload);
  data ? yield put(setMainPersonInfo(data)) : addNotFoundUserNotification();
  yield put(setLoading(false));
}

export function* PersonInfoWatcher() {
  yield takeEvery(TRY_TO_GET_PERSON_INFO, PersonInfoWorker);
}
