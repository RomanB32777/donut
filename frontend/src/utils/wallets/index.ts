import { AnyAction, Dispatch } from "redux";
import { NavigateFunction } from "react-router-dom";
import axios from "axios";
import { exchangeNameTypes } from "types";

import { setSelectedBlockchain } from "store/types/Wallet";
import { tryToGetUser } from "store/types/User";
import { setLoading } from "store/types/Loading";
import {
  isInstall,
  getBlockchainData,
  getCurrentBlockchain,
  changeBlockchain,
  paymentMethod,
  getQuantityBalance,
  mint,
  getBadgeURI,
  createContract,
  getBalance,
  payForBadgeCreation,
  getGasPrice,
  getGasPriceForMethod,
} from "./methods";
import { IWalletConf, IWalletMethods } from "appTypes";

const walletMethods: IWalletMethods = {
  isInstall,
  getBlockchainData,
  getCurrentBlockchain,
  changeBlockchain,
  paymentMethod,
  getBalance,
  createContract,
  getBadgeURI,
  mint,
  getQuantityBalance,
  payForBadgeCreation,
  getGasPrice,
  getGasPriceForMethod,
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
  const blockchainData = await walletConf.getBlockchainData();
  const currentBlockchain = await walletConf.getCurrentBlockchain();

  if (blockchainData && currentBlockchain) {
    dispatch(setSelectedBlockchain(currentBlockchain.name));
    dispatch(tryToGetUser(blockchainData.address));
  } else if (!currentBlockchain && navigate) {
    const newBlockchaind = await walletConf.changeBlockchain("evmos");
    newBlockchaind ? dispatch(setSelectedBlockchain("evmos")) : navigate("/");
  } else dispatch(setLoading(false));
};

export { walletMethods, getUsdKoef, checkWallet };
