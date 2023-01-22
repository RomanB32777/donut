import { createContext } from "react";
import { IWalletConf } from "appTypes";
import { initValue } from "./values";

const WalletContext = createContext<IWalletConf>(initValue);

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WalletContext.Provider value={initValue}>
      {children}
    </WalletContext.Provider>
  );
};

export { initValue, WalletContext, WalletProvider };
