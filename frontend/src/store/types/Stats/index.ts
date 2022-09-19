export const SET_STATS = 'SET_STATS'
export const GET_STATS = 'GET_STATS'

export const setStats = (payload: any) => ({type: SET_STATS, payload})
export const getStats = (payload: number | string) => ({type: GET_STATS, payload})
