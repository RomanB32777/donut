import { IStatData } from "types";
import { IStatAction } from "../../../appTypes";
import { SET_STATS } from "./../../types/Stats/index";

const initialState: IStatData[] = [];

const StatsReducer = (state = initialState, action: IStatAction) => {
  switch (action.type) {
    case SET_STATS:
      return action.payload;

    default:
      return state;
  }
};

export default StatsReducer;
