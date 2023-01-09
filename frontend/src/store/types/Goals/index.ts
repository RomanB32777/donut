import { IGoalData } from "types";

const SET_GOALS = "SET_GOALS";
const GET_GOALS = "GET_GOALS";

const setGoals = (payload: IGoalData[]) => ({ type: SET_GOALS, payload });
const getGoals = (payload: number | string) => ({
  type: GET_GOALS,
  payload,
});

export { SET_GOALS, GET_GOALS, setGoals, getGoals };
