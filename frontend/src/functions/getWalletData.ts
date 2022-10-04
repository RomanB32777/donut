import { ethers } from "ethers";
import { walletsConf } from "../consts";
import { addInstallWalletNotification } from "../utils";

export const getMetamaskWallet = async () => {
  if ((window as any).ethereum) {
    const accounts = await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });
    if (accounts.length === 0) {
      return null;
    } else return accounts[0];
  } else {
    return null;
  }
};

export const metamaskWalletIsIntall = () =>
  (window as any).hasOwnProperty("ethereum");

export const getMetamaskData = async () => {
  if (metamaskWalletIsIntall()) {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const chainId = await (window as any).ethereum.request({
      method: "eth_chainId",
    });
    const blockchain = walletsConf["metamask"].blockchains.find(
      (b) => b.name === process.env.REACT_APP_BLOCKCHAIN
    );

    if (blockchain && chainId !== blockchain.chainId) {
      // 0x2328
      await (window as any).ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${Number(9000).toString(16)}`,
            chainName: "Evmos Testnet",
            nativeCurrency: {
              name: "test-Evmos",
              symbol: "tEVMOS",
              decimals: 18,
            },
            rpcUrls: ["https://eth.bd.evmos.dev:8545"],
            blockExplorerUrls: ["https://evm.evmos.dev"],
          },
        ],
      });
    }
    await provider.send("eth_requestAccounts", []);
    // (window as any).ethereum.request({ method: 'eth_requestAccounts' })
    const signer = provider.getSigner(0);
    const address = await signer.getAddress();
    return {
      signer,
      address,
      provider,
    };
  } else {
    addInstallWalletNotification(
      "Metamask",
      "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
    );
  }
};

export const getTronWallet = () => {
  if (
    (window as any).tronWeb &&
    (window as any).tronWeb.defaultAddress.base58
  ) {
    return { address: (window as any).tronWeb.defaultAddress.base58 };
  } else {
    addInstallWalletNotification(
      "TronLink",
      "https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec"
    );
    return { address: null };
  }
};

export const tronWalletIsIntall = () =>
  (window as any).hasOwnProperty("tronWeb");
