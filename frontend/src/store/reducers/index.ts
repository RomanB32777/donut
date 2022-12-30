import { combineReducers } from "redux"
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
    loading: LoadingReducer,
    notifications: NotificationsReducer,
    blockchain: WalletReducer,
    goals: GoalsReducer,
    stats: StatsReducer,
})

export { rootReducer }