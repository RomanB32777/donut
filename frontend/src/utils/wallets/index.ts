import axiosClient from "../../axiosClient";
import metamaskConf from "./metamask";
import tronlinkConf from "./tronlink";
import { IWalletsConf } from "./types";

export const getUsdKoef = async (
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

export const walletsConf: IWalletsConf = {
  tronlink: tronlinkConf,
  // metamask: metamaskConf,
};

export const currBlockchain = walletsConf[
  process.env.REACT_APP_WALLET || "metamask"
].blockchains.find((b) => b.name === process.env.REACT_APP_BLOCKCHAIN);
