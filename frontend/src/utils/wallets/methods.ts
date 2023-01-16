import { ethers, utils } from "ethers";
import { blockchainsType } from "types";

import { addInstallWalletNotification } from "..";
import { transferAbi } from "consts";
import {
  ICreateContractObj,
  IMintBadgeObj,
  IPayObj,
  IQuantityBalanceObj,
  IWalletConf,
  methodNames,
} from "appTypes";

export function isInstall() {
  return (window as any).hasOwnProperty("ethereum");
}

export async function getBlockchainData(this: IWalletConf) {
  if (this.isInstall()) {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );

    await provider.send("eth_requestAccounts", []);
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
    return null;
  }
}

export async function getCurrentBlockchain(this: IWalletConf) {
  if (this.isInstall()) {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );

    const network = await provider.getNetwork(); // await provider.send("eth_chainId", []);

    if (network.chainId) {
      const currentBlockchain = this.main_contract.blockchains.find(
        ({ chainId }) =>
          chainId.toLowerCase() ===
          `0x${Number(network.chainId).toString(16)}`.toLowerCase()
      );
      return currentBlockchain || null; // or this.blockchains[0] ???
    }
    return null;
  } else {
    addInstallWalletNotification(
      "Metamask",
      "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
    );
    return null;
  }
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
        console.log(switchError);
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
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
          } catch (addError) {
            console.log("add error", addError);
            return null;
          }
        }
        // User rejected the request
        else if (switchError.code === 4001) return null;
        else return null;
      }
    }
    // newBlockchain === currentBlockchain
    return chainId;
  }
  return null;
}

export async function paymentMethod({
  contract,
  signer,
  addressTo,
  sum,
}: IPayObj) {
  const smartContract = new ethers.Contract(
    contract,
    JSON.parse(transferAbi),
    signer
  );
  const tx = await smartContract.transferMoney(addressTo, {
    value: utils.parseEther(sum),
  });
  await tx.wait();
  return tx;
}

export async function getBalance(
  this: IWalletConf,
  setBalance?: (amount: number) => void
) {
  const blockchainData = await this.getBlockchainData();
  if (blockchainData) {
    const balance = await blockchainData.provider.getBalance(
      blockchainData.address
    );
    const intBalance = Number(utils.formatEther(balance.toString()));
    setBalance && setBalance(intBalance);
    return intBalance;
  }
  return 0;
}

export async function createContract({
  _uri,
  abi,
  bytecode,
  setLoadingStep,
}: ICreateContractObj) {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const signer = provider.getSigner(0);
  setLoadingStep({ finishedStep: 1, loadingStep: 2 });
  const Badge = new ethers.ContractFactory(abi, bytecode, signer);
  const badgeContract = await Badge.deploy(_uri); // deploy contracts
  console.log(badgeContract);
  setLoadingStep({ finishedStep: 2 });
  return { contract_address: badgeContract.address, result: "SUCCESS" };
}

export async function getBadgeURI(this: IWalletConf, contract_address: string) {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const { abi } = this.main_contract;
  if (abi) {
    const currentContract = new ethers.Contract(
      contract_address,
      abi,
      provider
    );
    const currentToken = await currentContract.uri(1);
    return currentToken;
  }
  return "";
}

export async function mint(this: IWalletConf, mintObj: IMintBadgeObj) {
  const { abi, address } = this.nft_contract;
  if (address) {
    const { addressTo } = mintObj;
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const signer = provider.getSigner(0);
    const currentContract = new ethers.Contract(address, abi, signer);
    const tx = await currentContract.mint(addressTo, 1, 1);
    await tx.wait();
  } else return;
}

export async function getQuantityBalance(
  this: IWalletConf,
  objForQuantityBalance: IQuantityBalanceObj
) {
  const { abi } = this.main_contract;
  if (abi) {
    const { supporter_address, contract_address, isCreator } =
      objForQuantityBalance;
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const currentContract = new ethers.Contract(
      contract_address,
      abi,
      provider
    );
    const quantityBadge = isCreator
      ? await currentContract.totalSupply(1)
      : await currentContract.balanceOf(supporter_address, 1);
    const quantityBadgeNum = quantityBadge.toNumber();
    return quantityBadgeNum;
  }
  return null;
}

export async function payForBadgeCreation(this: IWalletConf, price: number) {
  const { address, abi } = this.commission_contract;

  if (address) {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const signer = provider.getSigner(0);
    const commissionContract = new ethers.Contract(address, abi, signer);
    // const formatPrice = utils.parseEther(String(price));

    // console.log(" TETTTTE", utils.parseEther(String(price))); //ethers.BigNumber.from(String(price)));

    // const decimals = 18;
    const input = String(price); // Note: this is a string, e.g. user input
    const amount = ethers.utils.parseEther(input);

    console.log(amount.toNumber());

    const tx = await commissionContract.payForBadgeCreation({
      value: amount,
    });
    await tx.wait();
    return tx;
  }
  return;
}

export async function getGasPrice(this: IWalletConf) {
  const blockchainData = await this.getBlockchainData();

  if (blockchainData) {
    const { provider } = blockchainData;
    const gasPrice = await provider.getGasPrice();
    const numberPrice = utils.formatUnits(gasPrice, "ether");
    return Number(numberPrice);
  }
  return 0;
}

export async function getGasPriceForMethod(
  this: IWalletConf,
  methodName: methodNames
) {
  const { address, abi } = this.nft_contract;
  if (address) {
    const gasPrice = await this.getGasPrice();
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const contract = new ethers.Contract(address, abi, provider);

    console.log(contract, methodName);

    const functionGasPrice = await contract.estimateGas[methodName](
      "0xDEd725B3d5daAD06398D4b4Ca0Af462921325194",
      1,
      1,
      []
    );
    console.log(functionGasPrice);

    return functionGasPrice.toNumber() * gasPrice;
  }
  return 0;
}
