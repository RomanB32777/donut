const TRY_TO_GET_PERSON_INFO = "TRY_TO_GET_PERSON_INFO";
const SET_MAIN_PERSON_INFO = "SET_MAIN_PERSON_INFO";
const SET_ACTIVE_USERNAME = "SET_ACTIVE_USERNAME";

const tryToGetPersonInfo = (payload: string) => ({
  type: TRY_TO_GET_PERSON_INFO,
  payload,
});
const setMainPersonInfo = (payload: any) => ({
  type: SET_MAIN_PERSON_INFO,
  payload,
});

export {
  TRY_TO_GET_PERSON_INFO,
  SET_MAIN_PERSON_INFO,
  SET_ACTIVE_USERNAME,
  tryToGetPersonInfo,
  setMainPersonInfo,
};
