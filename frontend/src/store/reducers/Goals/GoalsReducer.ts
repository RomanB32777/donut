import { SET_GOALS } from './../../types/Goals/index';

const initialState = {
    
}

const GoalsReducer = (state = initialState, action: any) => {

    switch (action.type) {
        case SET_GOALS:
            return action.payload
        
        default:
            return state
    }
}

export default GoalsReducer