import { walletMethods } from "utils";
import { IWalletConf } from "appTypes/index";
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

export { initValue };
