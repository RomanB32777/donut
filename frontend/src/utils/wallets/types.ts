export interface IPayObj {
  contract: string;
  addressTo: string;
  sum: string;
  signer?: any;
}

export interface IBalanceObj {
  walletData: any;
  setBalance?: (amount: number) => void;
}

export interface IMintBadgeObj {
  contract_address: string;
  addressTo: string;
  signer?: any;
}

export interface ICreateContractObj {
  _uri: string;
  abi: any;
  bytecode: string;
  setLoadingStep: (steps: {
    loadingStep?: number;
    finishedStep?: number;
  }) => void;
}

export interface IWalletConf {
  blockchains: {
    address: string;
    name: string;
    icon: string;
    chainId?: string;
    chainName: string;
    badgeName: string;
    nativeCurrency: {
      symbol: string;
      name: string;
      decimals?: number;
    };
    rpcUrls?: string[];
    blockExplorerUrls?: string[];
  }[];
  icon: string;
  abi?: any[];
  bytecode: string;
  getWalletData: (blockchainName?: string) => Promise<any>;
  paymentMethod: (objForPay: IPayObj) => Promise<any>;
  getBalance: (objForBalance: IBalanceObj) => Promise<number>;
  createContract: (
    objForContract: ICreateContractObj
  ) => Promise<string | null>;
  getBadgeURI: (
    contract_address: string
  ) => Promise<string | null>;
  mintBadge: (
    objForMint: IMintBadgeObj
  ) => Promise<any>;
}

export interface IWalletsConf {
  [wallet: string]: IWalletConf;
}
