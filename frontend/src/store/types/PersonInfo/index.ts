export const TRY_TO_GET_PERSON_INFO = "TRY_TO_GET_PERSON_INFO";
export const SET_MAIN_PERSON_INFO = "SET_MAIN_PERSON_INFO";
export const SET_ACTIVE_USERNAME = "SET_ACTIVE_USERNAME";

export const tryToGetPersonInfo = (payload: string) => ({
  type: TRY_TO_GET_PERSON_INFO,
  payload,
});
export const setMainPersonInfo = (payload: any) => ({
  type: SET_MAIN_PERSON_INFO,
  payload,
});
