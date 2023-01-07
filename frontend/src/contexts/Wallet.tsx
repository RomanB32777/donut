import { createContext } from "react";
import { IWalletContext } from "../appTypes";
import { initValue } from "./values";

// const currentWalletName = process.env.REACT_APP_WALLET || "tronlink";
// const currentWalletConf = walletsConf[currentWalletName];

// export const contextValue: IWalletContext = {
//   walletConf,
//   // currentBlockchain,
//   // currentWalletName: currentWalletName as blockchainsType,

//   // currentBlockchain: IBlockchain;
// };

const WalletContext = createContext<IWalletContext>(initValue);

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WalletContext.Provider value={initValue}>
      {children}
    </WalletContext.Provider>
  );
};

export { initValue, WalletContext, WalletProvider };
