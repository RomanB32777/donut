import { IUser } from "types";

const TRY_TO_GET_USER = "TRY_TO_GET_USER";
const SET_USER = "SET_USER";

const tryToGetUser = (payload: string) => ({
  type: TRY_TO_GET_USER,
  payload,
});
const setUser = (payload: IUser) => ({ type: SET_USER, payload });

export { TRY_TO_GET_USER, SET_USER, tryToGetUser, setUser };
