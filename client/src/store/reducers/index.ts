import { combineReducers } from "redux"
import ModalReducer from "./Modal/ModalReducer"
import PersonInfoPageReducer from "./PersonInfo/PersonInfoPageReducer"
import PersonInfoReducer from "./PersonInfo/PersonInfoReducer"
import SearchReducer from "./Search/SearchReducer"
import UserReducer from "./User/UserReducer"
import LoadingReducer from "./Loading/LoadingReducer"

const rootReducer = combineReducers({
    user: UserReducer,
    search: SearchReducer,
    modal: ModalReducer,
    personInfo: PersonInfoReducer,
    personInfoPage: PersonInfoPageReducer,
    loading: LoadingReducer
})

export { rootReducer }