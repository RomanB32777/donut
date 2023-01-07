import { ethers } from "ethers";
import {
  ICreateContractObj,
  IMintBadgeObj,
  IPayObj,
  IQuantityBalanceObj,
  IWalletConf,
} from "../../appTypes";
import { addInstallWalletNotification } from "..";

const metamaskTransferAbi =
  '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address payable","name":"_creator","type":"address"}],"name":"transferMoney","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"withdrawPendingBalance","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}]';

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
      const currentBlockchain = this.blockchains.find(
        ({ chainId }) => chainId === `0x${Number(network.chainId).toString(16)}`
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
  blockchainName: string
) {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);

  const checkChainId = await (window as any).ethereum.request({
    method: "eth_chainId",
  });

  const blockchain = this.blockchains.find((b) => b.name === blockchainName);

  if (blockchain) {
    const { chainId, chainName, nativeCurrency, rpcUrls, blockExplorerUrls } =
      blockchain;
    if (checkChainId !== chainId) {
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
      // window.location.reload();
    }
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner(0);
    const address = await signer.getAddress();
    return {
      signer,
      address,
      provider,
      chainId,
    };
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
    JSON.parse(metamaskTransferAbi),
    signer
  );
  const tx = await smartContract.transferMoney(addressTo, {
    value: ethers.utils.parseEther(sum),
  });
  await tx.wait();
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
    const intBalance = Number(ethers.utils.formatEther(balance.toString()));
    setBalance && intBalance && setBalance(intBalance);
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
  const { abi } = this;
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

export async function mintBadge(this: IWalletConf, mintObj: IMintBadgeObj) {
  const { abi } = this;
  if (abi) {
    const { contract_address, addressTo } = mintObj;
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const signer = provider.getSigner(0);
    const currentContract = new ethers.Contract(contract_address, abi, signer);
    const tx = await currentContract.mint(addressTo, 1, 1);
    await tx.wait();
  } else return;
}

export async function getQuantityBalance(
  this: IWalletConf,
  objForQuantityBalance: IQuantityBalanceObj
) {
  const { abi } = this;
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
