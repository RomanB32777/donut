export const SET_MAIN_WALLET = "SET_MAIN_WALLET";

export const setSelectedBlockchain = (blockchainName: string) => {
  localStorage.setItem("main_blockchain", blockchainName);
  return { type: SET_MAIN_WALLET, payload: blockchainName };
};
