import {
  isInstall,
  checkAuthToken,
  getWalletData,
  requestAccounts,
  setAuthToken,
  getCurrentBlockchain,
  changeBlockchain,
  paymentMethod,
  getBalance,
  payForBadgeCreation,
  getGasPrice,
  getGasPriceForMethod,
} from "./methods";
import { IWalletMethods } from "appTypes";

const walletMethods: IWalletMethods = {
  isInstall,
  checkAuthToken,
  requestAccounts,
  getWalletData,
  getCurrentBlockchain,
  changeBlockchain,

  getBalance,
  getGasPrice,
  getGasPriceForMethod,
  transfer_contract_methods: {
    paymentMethod,
  },
  commission_contract_methods: {
    payForBadgeCreation,
  },
};

export { walletMethods, setAuthToken };
