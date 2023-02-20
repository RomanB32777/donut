import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { storageWalletKey } from "consts";
import { blockchainPayload } from "appTypes";

export const walletSlice = createSlice({
  name: "wallet",
  initialState: null as blockchainPayload,
  reducers: {
    setWallet(
      state,
      { payload: blockchainName }: PayloadAction<blockchainPayload>
    ) {
      blockchainName
        ? localStorage.setItem(storageWalletKey, blockchainName)
        : localStorage.removeItem(storageWalletKey);

      state = blockchainName;
      return state;
    },
  },
});

export default walletSlice.reducer;
