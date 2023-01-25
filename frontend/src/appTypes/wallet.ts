import { ethers } from "ethers";
import { blockchainsSymbols, blockchainsType, exchangeNameTypes } from "types";

interface ProviderRpcError extends Error {
  message: string;
  code: string | number;
  data?: unknown;
  reason?: string
}

interface IWalletInitData {
  userAddress: string | null;
}

interface IPayObj {
  contract: string;
  addressTo: string;
  sum: string;
  signer?: any;
}

interface IMintBadgeObj {
  contract_address: string;
  addressTo: string;
  signer?: any;
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

enum ContractTypesEnum {
  main_contract = "main_contract",
  commission_contract = "commission_contract",
  transfer_contract = "transfer_contract",
}

type contractTypes = keyof typeof ContractTypesEnum;

enum ContractTypeMethodsEnum {
  main_contract_methods = "main_contract_methods",
  commission_contract_methods = "commission_contract_methods",
  transfer_contract_methods = "transfer_contract_methods",
}

// type contractTypeMethods = keyof typeof ContractTypeMethodsEnum;

type IWalletState = {
  [contract in contractTypes]: {
    blockchains: IBlockchain[];
    abi: any[];
    icon?: string;
    linkInstall?: string;
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
  requestAccounts: () => Promise<boolean>
  getWalletData: () => Promise<IBlockchainData | null>;
  getCurrentBlockchain: () => Promise<IBlockchain | null>;
  changeBlockchain: (blockchainName: blockchainsType) => Promise<any>;
  getGasPrice: () => Promise<number>;
  getGasPriceForMethod: (
    // now in main contract
    methodName: methodNames,
    mathodParameters: any[]
  ) => Promise<number>;
  getBalance: (setBalance?: (amount: number) => void) => Promise<number>;

  // main
  [ContractTypeMethodsEnum.transfer_contract_methods]: {
    paymentMethod: (objForPay: IPayObj) => Promise<any>;
  };

  // commision
  [ContractTypeMethodsEnum.commission_contract_methods]: {
    payForBadgeCreation: (price: number) => Promise<any>;
  };

  // getQuantityBalance: (objForQuantityBalance: IQuantityBalanceObj) => Promise<any>;
  // findAndGetBlockchain: (blockchainName: blockchainsType) => IBlockchain | null;
  // safeTransferFrom: (transferBadgeInfo: ITransferBadgeInfo) => Promise<any>;
  // getTransactionInfo: (hash: string) => Promise<any>;
}

type methodNames = keyof IWalletMethods;

interface IWalletConf extends IWalletState, IWalletMethods {}

type currencyBlockchainsType = {
  [key in exchangeNameTypes]: string;
};

export type {
  ProviderRpcError,
  IWalletInitData,
  IPayObj,
  IMintBadgeObj,
  IBlockchain,
  IWalletState,
  blockchainPayload,
  IBlockchainAction,
  IBlockchainData,
  IWalletMethods,
  methodNames,
  IWalletConf,
  currencyBlockchainsType,
};
