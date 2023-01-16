import { IGoalData } from "types";
import { IGoalAction } from "appTypes";
import { SET_GOALS } from "store/types/Goals/index";

const initialState: IGoalData[] = [];

const GoalsReducer = (state = initialState, action: IGoalAction) => {
  switch (action.type) {
    case SET_GOALS:
      return action.payload;

    default:
      return state;
  }
};

export default GoalsReducer;
