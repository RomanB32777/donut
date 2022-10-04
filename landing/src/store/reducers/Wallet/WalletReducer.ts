import { SET_MAIN_WALLET } from "../../types/Wallet"

const initialState = {
    
}

const WalletReducer = (state = initialState, action: any) => {

    switch (action.type) {
        case SET_MAIN_WALLET:
            return action.payload

        default:
            return state
    }
}

export default WalletReducer