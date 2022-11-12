import {
  isInstallMetamaskWallet,
  isInstallTronWallet,
} from "./functions/getWalletData";

import MetaMaskFoxBig from "./assets/MetaMask_Fox_big.png";
import TronlinkBig from "./assets/tronlink_big.png";
import EvmosBig from "./assets/evmos_big.png";
import KlaytnBig from "./assets/klaytn_big.png";
import TrxBig from "./assets/trx_big.png";

interface IWallet {
  [walletName: string]: {
    img: string;
    isInstallMethod: () => boolean;
    installLink: string;
    blockchains: {
      name: string;
      appLink: string;
      img: string;
    }[];
  };
}

export const wallets: IWallet = {
  metamask: {
    img: MetaMaskFoxBig,
    isInstallMethod: isInstallMetamaskWallet,
    installLink:
      "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
    blockchains: [
      // {
      //   name: "tEVMOS Testnet",
      //   appLink: "https://evmos.cryptodonutz.xyz/",
      //   img: EvmosBig,
      // },
      {
        name: "Klaytn Testnet",
        appLink: "https://klaytn.cryptodonutz.xyz/",
        img: KlaytnBig,
      },
    ],
  },
  tronlink: {
    img: TronlinkBig,
    isInstallMethod: isInstallTronWallet,
    installLink:
      "https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec",
    blockchains: [
      {
        name: "Tron Nile Testnet",
        appLink: "https://tron.cryptodonutz.xyz/",
        img: TrxBig
      },
    ],
  },
};

export const url = "/images/";
