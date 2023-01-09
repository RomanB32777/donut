import { AnyAction, Dispatch } from "redux";
import { NavigateFunction } from "react-router-dom";
import axiosClient from "modules/axiosClient";
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
  mintBadge,
  getBadgeURI,
  createContract,
  getBalance,
} from "./methods";
import { IWalletConf } from "appTypes";

const walletMethods = {
  isInstall,
  getBlockchainData,
  getCurrentBlockchain,
  changeBlockchain,
  paymentMethod,
  getBalance,
  createContract,
  getBadgeURI,
  mintBadge,
  getQuantityBalance,
};

const getUsdKoef = async (
  blockchain: string, // currencyTypes
  setUsdtKoef?: (price: number) => void
) => {
  const { data } = await axiosClient.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${blockchain}&vs_currencies=usd`
  );
  setUsdtKoef && data[blockchain] && setUsdtKoef(+data[blockchain].usd);
  if (data[blockchain]) return +data[blockchain].usd;
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
  } else {
    console.log("false?");
    dispatch(setLoading(false));
  }
};

export { walletMethods, getUsdKoef, checkWallet };
