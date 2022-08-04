import { SET_LATEST_DONATIONS_PERSON_INFO, SET_MAIN_PERSON_INFO, SET_TOP_SUPPORTERS_PERSON_INFO } from "../../types/PersonInfo"

const initialState: any = {
    main_info: {
        username: '',
        creation_date: '',
        person_name: '',
        avatarlink: '',
        twitter: '',
        discord: '',
        facebook: '',
        google: '',
        backgroundLink: '',
    },
    top_supporters: [],
    latest_donations: [],
}

const PersonInfoReducer = (state = initialState, action: any) => {

    switch (action.type) {

        case SET_MAIN_PERSON_INFO:
            return {
                ...state,
                main_info: action.payload
            }
        
        case SET_TOP_SUPPORTERS_PERSON_INFO:
            return {
                ...state,
                top_supporters: action.payload
            }

        case SET_LATEST_DONATIONS_PERSON_INFO: 
            return {
                ...state,
                latest_donantions: action.payload
            }

        default:
            return state
    }
}

export default PersonInfoReducer