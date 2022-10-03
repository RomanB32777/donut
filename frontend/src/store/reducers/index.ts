import { combineReducers } from "redux"
import PersonInfoPageReducer from "./PersonInfo/PersonInfoPageReducer"
import PersonInfoReducer from "./PersonInfo/PersonInfoReducer"
import UserReducer from "./User/UserReducer"
import LoadingReducer from "./Loading/LoadingReducer"
import NotificationsReducer from "./Notifications/NotificationsReducer"
import WalletReducer from "./Wallet/WalletReducer"
import GoalsReducer from "./Goals/GoalsReducer"
import StatsReducer from "./Stats/StatsReducer"

const rootReducer = combineReducers({
    user: UserReducer,
    personInfo: PersonInfoReducer,
    personInfoPage: PersonInfoPageReducer,
    loading: LoadingReducer,
    notifications: NotificationsReducer,
    wallet: WalletReducer,
    goals: GoalsReducer,
    stats: StatsReducer,
})

export { rootReducer }