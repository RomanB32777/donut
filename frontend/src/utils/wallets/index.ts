import { AnyAction, Dispatch } from "redux";
import { NavigateFunction } from "react-router-dom";
import { exchangeNameTypes } from "types";

import axiosClient from "modules/axiosClient";
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
import { logoutUser } from "utils";
import { RoutePaths } from "routes";
import { IWalletConf, IWalletMethods } from "appTypes";

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
  const { data, status } = await axiosClient.get(
    `/api/donation/exchange?blockchain=${blockchain}`
  );
  // `https://api.coingecko.com/api/v3/simple/price?ids=${blockchain}&vs_currencies=usd`
  if (status === 200 && data) {
    setUsdtKoef && setUsdtKoef(data);
    return data;
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
      } else if (navigate) navigate(`/${RoutePaths.register}`);

      // ????
      return true;
    } else {
      const newBlockchaind = await walletConf.changeBlockchain("evmos");
      if (newBlockchaind) dispatch(setSelectedBlockchain("evmos"));
      else navigate && navigate(RoutePaths.main);
    }
  } else {
    if (navigate) logoutUser({ dispatch, navigate });
    dispatch(setLoading(false));
  }
};

export { walletMethods, getUsdKoef, checkWallet };
