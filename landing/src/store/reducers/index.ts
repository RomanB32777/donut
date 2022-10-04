import { combineReducers } from "redux"
import UserReducer from "./User/UserReducer"
import LoadingReducer from "./Loading/LoadingReducer"
import WalletReducer from "./Wallet/WalletReducer"

const rootReducer = combineReducers({
    user: UserReducer,
    loading: LoadingReducer,
    wallet: WalletReducer,
})

export { rootReducer }