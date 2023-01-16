import { walletMethods } from "utils";
import { IWalletContext } from "appTypes/index";
import { walletInfo } from "consts";

export const initValue: IWalletContext = {
  walletConf: {
    ...walletInfo,
    ...walletMethods,
  },
};