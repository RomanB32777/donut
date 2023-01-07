import { walletMethods } from "../utils";
import { IWalletContext } from "../appTypes/index";
import { walletInfo } from "../consts";
// import {
//   initEmployee,
//   initEmployeeBase,
//   initEmployeeInTeam,
//   initialNearState,
//   initialTronlinkState,
//   initOrganization,
// } from "../consts";

export const initValue: IWalletContext = {
  walletConf: {
    ...walletInfo,
    ...walletMethods,
    // getTransactionInfo: async () => {},
  },
};
