import { SET_NOTIF } from "../../types/Notifications"

const initialState = {
    
}

const NotificationsReducer = (state = initialState, action: any) => {

    switch (action.type) {
        case SET_NOTIF:
            return action.payload

        default:
            return state
    }
}

export default NotificationsReducer