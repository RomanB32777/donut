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
  getCurrentBlockchain,
  changeBlockchain,
  paymentMethod,
  getBalance,
  payForBadgeCreation,
  getGasPrice,
  getGasPriceForMethod,
} from "./methods";
import { IWalletConf, IWalletMethods } from "appTypes";

const walletMethods: IWalletMethods = {
  isInstall,
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
  const blockchainData = await walletConf.getWalletData();

  if (blockchainData) {
    const currentBlockchain = await walletConf.getCurrentBlockchain();
    if (currentBlockchain)
      dispatch(setSelectedBlockchain(currentBlockchain.name));
    else if (navigate) {
      const newBlockchaind = await walletConf.changeBlockchain("evmos");
      newBlockchaind ? dispatch(setSelectedBlockchain("evmos")) : navigate("/");
    }
    dispatch(tryToGetUser(blockchainData.address));
  } else {
    navigate && navigate("/");
    dispatch(setLoading(false));
  }
};

export { walletMethods, getUsdKoef, checkWallet };
