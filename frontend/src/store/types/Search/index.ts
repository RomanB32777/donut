export const TRY_TO_GET_PERSON_BY_NAME = 'TRY_TO_GET_PERSON_BY_NAME'
export const SET_SEARCH_CREATORS = 'SET_SEARCH_CREATORS'
export const CLOSE_CREATORS_TOGGLE_LIST = 'CLOSE_CREATORS_TOGGLE_LIST'

export const tryToGetPersonByName = (payload: string) => ({type: TRY_TO_GET_PERSON_BY_NAME, payload})
export const setSearchCreators = (payload: any[]) => ({type: SET_SEARCH_CREATORS, payload})
export const closeCreatorsToggleList = () => ({type: CLOSE_CREATORS_TOGGLE_LIST})