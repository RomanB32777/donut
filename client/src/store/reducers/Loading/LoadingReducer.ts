import { SET_LOADING } from "../../types/Loading"

const initialState = {
    isLoading: false
}

const LoadingReducer = (state = initialState, action: any) => {

    switch (action.type) {
        case SET_LOADING:
            return {isLoading: action.payload}

        default:
            return state
    }
}

export default LoadingReducer