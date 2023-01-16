import { ethers } from "ethers";
import { blockchainsSymbols, blockchainsType, exchangeNameTypes } from "types";

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
  name: blockchainsType;
  icon: string;
  chainId: string;
  chainName: string;
  badgeName: string;
  color: string;
  nativeCurrency: {
    symbol: blockchainsSymbols;
    name: string;
    exchangeName: exchangeNameTypes;
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

type contractTypes = "main_contract" | "commission_contract" | "nft_contract";

type IWalletState = {
  [contract in contractTypes]: {
    blockchains: IBlockchain[];
    icon: string;
    linkInstall: string;
    abi: any[];
    bytecode: string;
    address?: string;
  };
};

type blockchainPayload = blockchainsType | null;

interface IBlockchainAction {
  type: string;
  payload: blockchainPayload;
}

interface IWalletMethods {
  isInstall: () => boolean;
  getBlockchainData: () => Promise<IBlockchainData | null>;
  getCurrentBlockchain: () => Promise<IBlockchain | null>;
  // findAndGetBlockchain: (blockchainName: blockchainsType) => IBlockchain | null;
  changeBlockchain: (blockchainName: blockchainsType) => Promise<any>;
  paymentMethod: (objForPay: IPayObj) => Promise<any>;
  getBalance: (setBalance?: (amount: number) => void) => Promise<number>;
  createContract: (objForContract: ICreateContractObj) => Promise<any>;
  getBadgeURI: (contractAddress: string) => Promise<string | null>;
  mint: (objForMint: IMintBadgeObj) => Promise<any>;
  getQuantityBalance: (
    objForQuantityBalance: IQuantityBalanceObj
  ) => Promise<any>;
  payForBadgeCreation: (price: number) => Promise<any>
  getGasPrice: () => Promise<number>;
  getGasPriceForMethod: (methodName: methodNames) => Promise<number>;
  // getTransactionInfo: (hash: string) => Promise<any>;
}

type methodNames = keyof IWalletMethods;

interface IWalletConf extends IWalletState, IWalletMethods {}

type currencyBlockchainsType = {
  [key in exchangeNameTypes]: string;
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
  IBlockchainData,
  IWalletMethods,
  methodNames,
  IWalletConf,
  currencyBlockchainsType,
  IWalletContext,
};
