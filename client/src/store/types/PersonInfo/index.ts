export const TRY_TO_GET_PERSON_INFO = 'TRY_TO_GET_PERSON_INFO'
export const SET_MAIN_PERSON_INFO = 'SET_MAIN_PERSON_INFO'
export const SET_TOP_SUPPORTERS_PERSON_INFO = 'SET_TOP_SUPPORTERS_PERSON_INFO'
export const SET_LATEST_DONATIONS_PERSON_INFO = 'SET_LATEST_DONATIONS_PERSON_INFO'

export const GET_PERSON_INFO_PAGE = 'GET_PERSON_INFO_PAGE'
export const SET_PERSON_INFO_PAGE_DATA = 'SET_PERSON_INFO_PAGE_DATA'

export const tryToGetPersonInfo = (payload: any) => ({type: TRY_TO_GET_PERSON_INFO, payload})
export const setMainPersonInfo = (payload: any) => ({type: SET_MAIN_PERSON_INFO, payload})
export const setTopSupportersPersonInfo = (payload: any) => ({type: SET_TOP_SUPPORTERS_PERSON_INFO, payload})
export const setLatestDonationsPersonInfo = (payload: any) => ({type: SET_LATEST_DONATIONS_PERSON_INFO, payload})


export const getPersonInfoPage = (payload: any) => ({type: GET_PERSON_INFO_PAGE, payload})
export const setPersonInfoPageData = (payload: any) => ({type: SET_PERSON_INFO_PAGE_DATA, payload})