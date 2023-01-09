const SET_STATS = "SET_STATS";
const GET_STATS = "GET_STATS";

const setStats = (payload: any) => ({ type: SET_STATS, payload });
const getStats = (payload: number | string) => ({
  type: GET_STATS,
  payload,
});

export { SET_STATS, GET_STATS, setStats, getStats };
