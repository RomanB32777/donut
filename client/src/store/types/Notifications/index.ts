export const SET_NOTIF = 'SET_NOTIF'
export const GET_NOTIF = 'GET_NOTIF'

export const setNotifications = (payload: any) => ({type: SET_NOTIF, payload})
export const getNotifications = (payload: number) => ({type: GET_NOTIF, payload})
