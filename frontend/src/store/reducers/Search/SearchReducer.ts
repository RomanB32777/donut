import { CLOSE_CREATORS_TOGGLE_LIST, SET_SEARCH_CREATORS } from "../../types/Search";

interface SearchStateInterface {
    isOpened: boolean;
    creatorsList: any[];
}

const initialState: SearchStateInterface = {
    isOpened: false,
    creatorsList: [],
}

const SearchReducer = (state = initialState, action: {type: string; payload?: any}) => {

    switch (action.type) {

        case SET_SEARCH_CREATORS:
            if (action.payload.length > 0) {
                return {
                    isOpened: true,
                    creatorsList: action.payload,
                }
            } else {
                return {
                    isOpened: false,
                    creatorsList: [],
                }
            } 
        
        case CLOSE_CREATORS_TOGGLE_LIST:
            return {
                ...state,
                isOpened: false
            }
        
        case 'OPEN':
            return {
                isOpened: true,
                creatorsList: ['asdf', 'asdf32', 'svhiahf', 'sadfasdf', 'sadfsdf','fsda']
            }


        default:
            return state
    }
} 

export default SearchReducer