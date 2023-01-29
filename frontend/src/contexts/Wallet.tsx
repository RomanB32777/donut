import { createContext } from "react";
import { IWalletConf } from "appTypes";
import { walletMethods } from "utils";
import { walletInfo } from "consts";

const initNoBindedValue: IWalletConf = {
  ...walletInfo,
  ...walletMethods,
};

const { transfer_contract_methods, commission_contract_methods, ...walletConf } =
  initNoBindedValue;

const initValue: IWalletConf = {
  ...walletConf,
  transfer_contract_methods: {
    paymentMethod:
      walletMethods.transfer_contract_methods.paymentMethod.bind(walletConf),
  },
  commission_contract_methods: {
    payForBadgeCreation:
      walletMethods.commission_contract_methods.payForBadgeCreation.bind(
        walletConf
      ),
  },
};

const WalletContext = createContext<IWalletConf>(initValue);

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WalletContext.Provider value={initValue}>
      {children}
    </WalletContext.Provider>
  );
};

export { initValue, WalletContext, WalletProvider };
