import { AnyAction, Dispatch } from "redux";
import { NavigateFunction } from "react-router-dom";
import axios from "axios";
import { exchangeNameTypes } from "types";

import { setSelectedBlockchain } from "store/types/Wallet";
import { tryToGetUser } from "store/types/User";
import { setLoading } from "store/types/Loading";
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
import { checkIsExistUser } from "../asyncMethods";
import { IWalletConf, IWalletMethods } from "appTypes";
import { logoutUser } from "utils";

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

const getUsdKoef = async (
  blockchain: exchangeNameTypes,
  setUsdtKoef?: (price: number) => void
) => {
  const { data } = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${blockchain}&vs_currencies=usd`
  );
  if (data[blockchain]) {
    setUsdtKoef && setUsdtKoef(+data[blockchain].usd);
    return +data[blockchain].usd;
  }
  return 0;
};

const checkWallet = async ({
  walletConf,
  dispatch,
  navigate,
}: {
  walletConf: IWalletConf;
  dispatch: Dispatch<AnyAction>;
  navigate?: NavigateFunction;
}) => {
  const walletData = await walletConf.getWalletData();

  if (walletData) {
    const { address } = walletData;
    const currentBlockchain = await walletConf.getCurrentBlockchain();
    if (currentBlockchain) {
      // set blockchain and check user registr
      dispatch(setSelectedBlockchain(currentBlockchain.name));
      const isExistUser = await checkIsExistUser(address);

      if (isExistUser) {
        dispatch(tryToGetUser(address));
        return true;
        // not registered user - to registration page
      } else if (navigate) navigate("/register");

      // ????
      return true;
    } else if (navigate) {
      const newBlockchaind = await walletConf.changeBlockchain("evmos");
      newBlockchaind ? dispatch(setSelectedBlockchain("evmos")) : navigate("/");
    }
  } else {
    if (navigate) logoutUser({ dispatch, navigate });
    dispatch(setLoading(false));
  }
};

export { walletMethods, getUsdKoef, checkWallet };
