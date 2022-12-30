import { call, put, takeEvery } from "redux-saga/effects";
import axiosClient from "../../axiosClient";
import { setLoading } from "../../store/types/Loading";
import { GET_GOALS, setGoals } from "../../store/types/Goals";

const asyncGetGoals = async (creator_id: string) => {
  const { status, data } = await axiosClient.get(
    `/api/widget/goals-widgets/${creator_id}`
  );
  if (status === 200) return data;
  return null;
};

function* GoalsWorker(action: any): any {
  yield put(setLoading(true));
  const data: any = yield call(asyncGetGoals, action.payload);
  if (data) {
    yield put(setGoals(data));
  }
  yield put(setLoading(false));
}

export function* GoalsWatcher() {
  yield takeEvery(GET_GOALS, GoalsWorker);
}
