export const SET_GOALS = 'SET_GOALS'
export const GET_GOALS = 'GET_GOALS'

export const setGoals = (payload: any) => ({type: SET_GOALS, payload})
export const getGoals = (payload: number | string) => ({type: GET_GOALS, payload})
