export const SET_NOTIF = 'SET_NOTIF'
export const GET_NOTIF = 'GET_NOTIF'
export const SET_MAIN_NOTIF = 'SET_MAIN_NOTIF'

export const setNotifications = (payload: any) => ({type: SET_NOTIF, payload})
export const setNainNotification = (payload: any) => ({type: SET_MAIN_NOTIF, payload})
export const getNotifications = (payload: number | string) => ({type: GET_NOTIF, payload})
