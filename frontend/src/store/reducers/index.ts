import { combineReducers } from "redux"
import ModalReducer from "./Modal/ModalReducer"
import PersonInfoPageReducer from "./PersonInfo/PersonInfoPageReducer"
import PersonInfoReducer from "./PersonInfo/PersonInfoReducer"
import SearchReducer from "./Search/SearchReducer"
import UserReducer from "./User/UserReducer"
import LoadingReducer from "./Loading/LoadingReducer"
import NotificationsReducer from "./Notifications/NotificationsReducer"
import WalletReducer from "./Wallet/WalletReducer"
import GoalsReducer from "./Goals/GoalsReducer"

const rootReducer = combineReducers({
    user: UserReducer,
    search: SearchReducer,
    modal: ModalReducer,
    personInfo: PersonInfoReducer,
    personInfoPage: PersonInfoPageReducer,
    loading: LoadingReducer,
    notifications: NotificationsReducer,
    wallet: WalletReducer,
    goals: GoalsReducer,
})

export { rootReducer }