import { SET_PERSON_INFO_PAGE_DATA } from "../../types/PersonInfo"

const initialState = {
    page: 'supporters',
    data: {}
}

const PersonInfoPageReducer = ( state = initialState, action: any) => {

    switch (action.type) {

        case SET_PERSON_INFO_PAGE_DATA:
            return {
                ...action.payload
            }

        default:
            return state
    }
}

export default PersonInfoPageReducer