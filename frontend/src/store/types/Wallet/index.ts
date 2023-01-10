import { storageWalletKey } from "consts";
import { blockchainPayload } from "appTypes";

const SET_MAIN_WALLET = "SET_MAIN_WALLET";

const setSelectedBlockchain = (blockchainName: blockchainPayload) => {
  blockchainName
    ? localStorage.setItem(storageWalletKey, blockchainName)
    : localStorage.removeItem(storageWalletKey);
  return { type: SET_MAIN_WALLET, payload: blockchainName };
};

export { SET_MAIN_WALLET, setSelectedBlockchain };
