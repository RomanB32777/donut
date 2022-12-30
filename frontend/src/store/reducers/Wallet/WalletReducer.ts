import { blockchainPayload, IBlockchainAction } from "../../../types";
import { SET_MAIN_WALLET } from "../../types/Wallet";

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

// const UserReducer: (state: IUser | undefined, action: IUserAction) => IUser
