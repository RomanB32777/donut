import { ILoadingAction } from "appTypes";
import { SET_LOADING } from "store/types/Loading";

const initialState = true;

const LoadingReducer = (state = initialState, action: ILoadingAction) => {
  switch (action.type) {
    case SET_LOADING:
      return action.payload;

    default:
      return state;
  }
};

export default LoadingReducer;