import {
  isInstall,
  getWalletData,
  requestAccounts,
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

export { walletMethods };
