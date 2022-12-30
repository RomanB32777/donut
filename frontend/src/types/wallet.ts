import { ethers } from "ethers";
import { blockchainsType } from "types";

interface IWalletInitData {
  userAddress: string | null;
}

interface IPayObj {
  contract: string;
  addressTo: string;
  sum: string;
  signer?: any;
}

interface IQuantityBalanceObj {
  contract_address: string;
  supporter_address: string;
  isCreator: boolean;
}

interface IMintBadgeObj {
  contract_address: string;
  addressTo: string;
  signer?: any;
}

interface ICreateContractObj {
  _uri: string;
  abi: any;
  bytecode: string;
  setLoadingStep: (steps: {
    loadingStep?: number;
    finishedStep?: number;
  }) => void;
}

interface IBlockchain {
  address: string;
  name: string;
  icon: string;
  chainId: string;
  chainName: string;
  badgeName: string;
  color: string;
  nativeCurrency: {
    symbol: string;
    name: string;
    exchangeName: string;
    decimals?: number;
  };
  rpcUrls?: string[];
  blockExplorerUrls?: string[];
}

interface IBlockchainData {
  signer: ethers.providers.JsonRpcSigner;
  provider: ethers.providers.Web3Provider;
  address: string;
}

interface IWalletState {
  blockchains: IBlockchain[];
  icon: string;
  linkInstall: string;
  abi: any[];
  bytecode: string;
}

type blockchainPayload = blockchainsType | null;

interface IBlockchainAction {
  type: string;
  payload: blockchainPayload;
}

interface IWalletMethods {
  isInstall: () => boolean;
  getBlockchainData: () => Promise<IBlockchainData | null>;
  getCurrentBlockchain: () => Promise<IBlockchain | null>;
  changeBlockchain: (blockchainName: string) => Promise<any>;
  paymentMethod: (objForPay: IPayObj) => Promise<any>;
  getBalance: (setBalance?: (amount: number) => void) => Promise<number>;
  createContract: (objForContract: ICreateContractObj) => Promise<any>;
  getBadgeURI: (contract_address: string) => Promise<string | null>;
  mintBadge: (objForMint: IMintBadgeObj) => Promise<any>;
  getQuantityBalance: (
    objForQuantityBalance: IQuantityBalanceObj
  ) => Promise<any>;
  // getTransactionInfo: (hash: string) => Promise<any>;
}

interface IWalletConf extends IWalletState, IWalletMethods {}

type currencyBlockchainsType = {
  [key in blockchainsType]: string;
};

interface IWalletContext {
  walletConf: IWalletConf;
}

export type {
  IWalletInitData,
  IPayObj,
  IQuantityBalanceObj,
  IMintBadgeObj,
  ICreateContractObj,
  IBlockchain,
  IWalletState,
  blockchainPayload,
  IBlockchainAction,
  IWalletMethods,
  IWalletConf,
  currencyBlockchainsType,
  IWalletContext,
};
