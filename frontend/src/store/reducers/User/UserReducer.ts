import { SET_USER } from "../../types/User"

const initialState = {
    // isLogin: false
}

const UserReducer = (state = initialState, action: any) => {

    switch (action.type) {
        case SET_USER:
            return action.payload

        default:
            return state
    }
}

export default UserReducer