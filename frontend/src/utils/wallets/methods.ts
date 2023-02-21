import { ethers, Contract, utils } from "ethers";
import Web3Token from "web3-token";
import { blockchainsType } from "types";

import { addAuthWalletNotification, addInstallWalletNotification } from "..";
import { storageToken, storageWalletKey } from "consts";
import { IPayObj, IWalletConf, methodNames, ProviderRpcError } from "appTypes";

export function isInstall() {
  return (
    (window as any).hasOwnProperty("ethereum") &&
    (window as any).ethereum?.isMetaMask
  );
}

export async function requestAccounts() {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const adresses = await provider.send("eth_requestAccounts", []);
  return Boolean(adresses?.length);
}

export async function setAuthToken(signer?: ethers.providers.JsonRpcSigner) {
  localStorage.removeItem(storageToken);
  let signerObj = signer;

  if (!signerObj) {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    signerObj = provider.getSigner(0);
  }

  // generating a token with 1 day of expiration time
  const token = await Web3Token.sign(
    async (msg: any) => signerObj && (await signerObj.signMessage(msg)),
    "1d"
  );
  localStorage.setItem(storageToken, token);
  return token;
}

export async function checkAuthToken(this: IWalletConf) {
  let token = localStorage.getItem(storageToken);

  if (!token) {
    const wallet = await this.getWalletData();
    if (wallet) {
      const { signer } = wallet;

      // generating a token with 1 day of expiration time
      token = await setAuthToken(signer);
    }
  }
  return token;
}

export async function getWalletData(this: IWalletConf) {
  if (this.isInstall()) {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );

    const accounts = await provider.listAccounts();
    if (!accounts.length) {
      localStorage.removeItem(storageWalletKey);
      addAuthWalletNotification();
      return null;
    }

    if (localStorage.getItem(storageWalletKey))
      await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner(0);
    const address = await signer.getAddress();

    return {
      signer,
      address,
      provider,
    };
  } else {
    localStorage.removeItem(storageWalletKey);
    addInstallWalletNotification(
      "Metamask",
      this.main_contract.linkInstall || ""
    );
    return null;
  }
}

export async function getCurrentBlockchain(this: IWalletConf) {
  const wallet = await this.getWalletData();
  if (wallet) {
    const { provider } = wallet;
    const network = await provider.getNetwork(); // await provider.send("eth_chainId", []);

    if (network.chainId) {
      const currentBlockchain = this.main_contract.blockchains.find(
        ({ chainId }) =>
          chainId.toLowerCase() ===
          `0x${Number(network.chainId).toString(16)}`.toLowerCase()
      );
      return currentBlockchain || null; // or this.blockchains[0] ???
    }
  }
  return null;
}

export async function changeBlockchain(
  this: IWalletConf,
  blockchainName: blockchainsType
) {
  const checkChainId = await (window as any).ethereum.request({
    method: "eth_chainId",
  });

  const blockchain = this.main_contract.blockchains.find(
    (b) => b.name === blockchainName
  );

  if (blockchain) {
    const { chainId, chainName, nativeCurrency, rpcUrls, blockExplorerUrls } =
      blockchain;
    if (checkChainId !== chainId) {
      try {
        await (window as any).ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }],
        });
        return chainId;
      } catch (switchError: any) {
        const switchErrorInfo = switchError as ProviderRpcError;
        console.log("switch error", switchErrorInfo);

        // for mobile metamask version
        const mobileSwichError = switchError.data?.originalError;

        // This error code indicates that the chain has not been added to MetaMask.
        if (switchErrorInfo.code === 4902 || mobileSwichError?.code === 4902) {
          try {
            await (window as any).ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId, // `0x${Number(9000).toString(16)}`,
                  chainName,
                  nativeCurrency: {
                    symbol: nativeCurrency.symbol,
                    name: nativeCurrency.name,
                    decimals: nativeCurrency.decimals,
                  },
                  rpcUrls,
                  blockExplorerUrls,
                },
              ],
            });
            return chainId;
          } catch (addError: any) {
            const errInfo = addError as ProviderRpcError;
            console.log("add error", errInfo);
            return null;
          }
        }
        // User rejected the request
        else if (
          switchErrorInfo.code === 4001 ||
          mobileSwichError?.code === 4001
        )
          return null;
        else return null;
      }
    }
    // newBlockchain === currentBlockchain
    return chainId;
  }
  return null;
}

export async function getBalance(
  this: IWalletConf,
  setBalance?: (amount: number) => void
) {
  const walletData = await this.getWalletData();
  if (walletData) {
    const { provider, address } = walletData;
    const balance = await provider.getBalance(address);
    const intBalance = Number(utils.formatEther(balance.toString()));
    setBalance && setBalance(intBalance);
    return intBalance;
  }
  return 0;
}

export async function getGasPrice(this: IWalletConf) {
  const walletData = await this.getWalletData();

  if (walletData) {
    const { provider } = walletData;
    const gasPrice = await provider.getGasPrice();
    const numberPrice = utils.formatUnits(gasPrice, "ether");
    return Number(numberPrice);
  }
  return 0;
}

export async function getGasPriceForMethod(
  this: IWalletConf,
  methodName: methodNames,
  mathodParameters: any[]
) {
  const { address, abi } = this.main_contract;
  if (address) {
    const gasPrice = await this.getGasPrice();
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const contract = new Contract(address, abi, provider);
    const functionGasPrice = await contract.estimateGas[methodName](
      ...mathodParameters
    );
    return functionGasPrice.toNumber() * gasPrice;
  }
  return 0;
}

export async function paymentMethod(this: IWalletConf, payObj: IPayObj) {
  const { abi } = this.transfer_contract;
  const { contract, signer, addressTo, sum } = payObj;

  const smartContract = new Contract(contract, abi, signer);
  const tx = await smartContract.transferMoney(addressTo, {
    value: utils.parseEther(sum),
  });
  const res = await tx.wait();
  return res;
}

export async function payForBadgeCreation(this: IWalletConf, price: number) {
  const { address, abi } = this.commission_contract;

  if (address) {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const signer = provider.getSigner(0);
    const commissionContract = new Contract(address, abi, signer);

    const tx = await commissionContract.payForBadgeCreation({
      value: utils.parseEther(String(price)),
    });
    const res = await tx.wait();
    return res;
  }
  return;
}

// export async function safeTransferFrom(
//   this: IWalletConf,
//   transferBadgeInfo: ITransferBadgeInfo
// ) {
//   const { address: contractAddress, abi } = this.nft_contract;

//   const { toAddress, badgeId } = transferBadgeInfo;

//   const walletData = await this.getWalletData();

//   if (walletData && contractAddress) {
//     const { address, signer } = walletData;
//     const currentContract = new Contract(contractAddress, abi, signer);

//     const tx = await currentContract.safeTransferFrom(
//       address, // user wallet address
//       toAddress,
//       badgeId,
//       1,
//       []
//       // { gasLimit: 3e7 }
//     );
//     const res = await tx.wait();
//     return res;
//   }
//   return null;
// }
