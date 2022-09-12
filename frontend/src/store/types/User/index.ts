export const TRY_TO_GET_USER = 'TRY_TO_GET_USER'
export const SET_USER = 'SET_USER'

export const tryToGetUser = (payload: string) => ({type: TRY_TO_GET_USER, payload})
export const setUser = (payload: string) => ({type: SET_USER, payload})