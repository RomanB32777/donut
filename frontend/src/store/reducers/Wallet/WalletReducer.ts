import { blockchainPayload, IBlockchainAction } from "appTypes";
import { SET_MAIN_WALLET } from "store/types/Wallet";

const initialState: blockchainPayload = null;

const WalletReducer = (
  state: blockchainPayload = initialState,
  action: IBlockchainAction
) => {
  switch (action.type) {
    case SET_MAIN_WALLET:
      return action.payload;

    default:
      return state;
  }
};

export default WalletReducer;