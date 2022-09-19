import { SET_STATS } from './../../types/Stats/index';

const initialState = {
    
}

const StatsReducer = (state = initialState, action: any) => {

    switch (action.type) {
        case SET_STATS:
            return action.payload
        
        default:
            return state
    }
}

export default StatsReducer