import { call, put, takeEvery } from "redux-saga/effects";
import axiosClient from "../../axiosClient";
import { setLoading } from "../../store/types/Loading";
import { GET_STATS, setStats } from "../../store/types/Stats";

const asyncGetStats = async (creator_id: string) => {
  const { status, data } = await axiosClient.get(
    `/api/widget/stats-widgets/${creator_id}`
  );
  if (status === 200) return data;
  return null;
};

function* StatsWorker(action: any): any {
  yield put(setLoading(true));
  const data: any = yield call(asyncGetStats, action.payload);
  if (data) {
    yield put(setStats(data));
  }
  yield put(setLoading(false));
}

export function* StatsWatcher() {
  yield takeEvery(GET_STATS, StatsWorker);
}
