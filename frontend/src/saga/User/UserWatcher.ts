import { call, put, takeEvery } from "redux-saga/effects";
import { IUser } from "types";
import axiosClient from "modules/axiosClient";
import { setLoading } from "store/types/Loading";
import { setUser, TRY_TO_GET_USER } from "store/types/User";

const asyncGetUser = async (address: string) => {
  const { status, data } = await axiosClient.get(`/api/user/${address}`);
  if (status === 200) return data;
  return null;
};

function* UserWorker(action: any): any {
  yield put(setLoading(true));
  const user: IUser = yield call(asyncGetUser, action.payload);
  if (user) yield put(setUser(user));
  yield put(setLoading(false));
}

export function* UserWatcher() {
  yield takeEvery(TRY_TO_GET_USER, UserWorker);
}
