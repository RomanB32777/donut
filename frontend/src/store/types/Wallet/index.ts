import { blockchainsType } from "types";
import { storageWalletKey } from "consts";

type setBlockchainNames = blockchainsType | "";

const SET_MAIN_WALLET = "SET_MAIN_WALLET";

const setSelectedBlockchain = (blockchainName: setBlockchainNames) => {
  localStorage.setItem(storageWalletKey, blockchainName);
  return { type: SET_MAIN_WALLET, payload: blockchainName };
};

export { SET_MAIN_WALLET, setSelectedBlockchain };