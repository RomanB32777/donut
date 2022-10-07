import { ethers } from "ethers";
import {
  addAuthWalletNotification,
  addErrorNotification,
  addInstallWalletNotification,
} from "./utils";
import metamaskIcon from "./assets/MetaMask_Fox.png";
import tronlinkIcon from "./assets/tronlinkIcon.png";
import evmosIcon from "./assets/evmos.png";
import klaytnIcon from "./assets/klaytn.png";

// period-time
export declare type periodItemsTypes = "today" | "7days" | "30days" | "year";

export type IFilterPeriodItems = {
  [key in periodItemsTypes]: string;
};

export const filterPeriodItems: IFilterPeriodItems = {
  today: "Today",
  "7days": "Last 7 days",
  "30days": "Last 30 days",
  year: "This year",
};

export const getTimePeriodQuery: (timePeriod: string) => periodItemsTypes = (
  timePeriod
) => {
  const findKey = Object.keys(filterPeriodItems).find(
    (key) => filterPeriodItems[key as periodItemsTypes] === timePeriod
  );
  return findKey ? (findKey as periodItemsTypes) : "7days"; // : keyof IFilterPeriodItems
};

// period-current-time
export declare type currentPeriodItemsTypes = "yesterday" | "all" | "custom";

export declare type allPeriodItemsTypes =
  | periodItemsTypes
  | currentPeriodItemsTypes;

declare type ICurrentPeriodItemsTypes = {
  [key in allPeriodItemsTypes]: string;
};

export type IFilterCurrentPeriodItems = ICurrentPeriodItemsTypes;

export const filterCurrentPeriodItems: IFilterCurrentPeriodItems = {
  yesterday: "Yesterday",
  today: "Today",
  "7days": "Last 7 days",
  "30days": "Last 30 days",
  year: "Current year",
  all: "All time",
  custom: "Custom date",
};

export const getCurrentTimePeriodQuery: (
  timePeriod: string
) => allPeriodItemsTypes = (timePeriod) => {
  const findKey = Object.keys(filterCurrentPeriodItems).find(
    (key) => filterCurrentPeriodItems[key as allPeriodItemsTypes] === timePeriod
  );
  return findKey ? (findKey as allPeriodItemsTypes) : "custom";
};

// stats-data
export declare type statsDataTypes =
  | "top-donations"
  | "latest-donations"
  | "top-supporters";

export type IStatsDataType = {
  [key in statsDataTypes]: string;
};

export const filterDataTypeItems: IStatsDataType = {
  "top-donations": "Top donations",
  "latest-donations": "Recent donations",
  "top-supporters": "Top supporters",
};

export const getStatsDataTypeQuery: (dataType: string) => statsDataTypes = (
  dataType
) => {
  const findKey = Object.keys(filterDataTypeItems).find(
    (key) => filterDataTypeItems[key as statsDataTypes] === dataType
  );
  return findKey ? (findKey as statsDataTypes) : "latest-donations";
};

export const url = "/images/";

// WALLETS
type tronErrors = "BANDWITH_ERROR" | "SIGERROR";

const TRON_WALLET_ERR: { [err in tronErrors]: string } = {
  BANDWITH_ERROR:
    "There is not enough bandwidth or TRX to burn to send a transaction.",
  SIGERROR: "Signature error",
};

const metamaskWalletIsIntall = () => (window as any).hasOwnProperty("ethereum");

const getTronWallet = (blockchainName?: any) =>
  new Promise((resolve) => {
    setTimeout(() => {
      if ((window as any).tronWeb)
        (window as any).tronWeb.defaultAddress.base58
          ? resolve({ address: (window as any).tronWeb.defaultAddress.base58 })
          : addAuthWalletNotification("Tronlink");
      else
        addInstallWalletNotification(
          "TronLink",
          "https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec"
        );
      resolve(null);
    }, 500);
  });

const getMetamaskData = async (blockchainName: any) => {
  if (metamaskWalletIsIntall()) {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const checkChainId = await (window as any).ethereum.request({
      method: "eth_chainId",
    });
    const blockchain = walletsConf["metamask"].blockchains.find(
      (b) => b.name === blockchainName
    );

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
      }
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner(0);
      const address = await signer.getAddress();
      return {
        signer,
        address,
        provider,
      };
    }
    return null;
  } else {
    addInstallWalletNotification(
      "Metamask",
      "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
    );
  }
};

interface IPayObj {
  contract: string;
  addressTo: string;
  sum: string;
  abi_transfer?: any;
  signer?: any;
}

interface IBalanceObj {
  address: string;
  provider?: any;
  setBalance?: (amount: number) => void;
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

const payByTron = async ({ contract, addressTo, sum }: IPayObj) => {
  let instance = await (window as any).tronWeb.contract().at(contract);
  const res = await instance.transferMoney(addressTo).send({
    feeLimit: 100_000_000,
    callValue: 1000000 * parseFloat(sum),
    shouldPollResponse: false,
  });
  return res;
};

const payByMetamask = async ({
  contract,
  abi_transfer,
  signer,
  addressTo,
  sum,
}: IPayObj) => {
  const smartContract = new ethers.Contract(
    contract,
    abi_transfer || [],
    signer
  );
  const tx = await smartContract.transferMoney(addressTo, {
    value: ethers.utils.parseEther(sum),
  });
  await tx.wait();
};

const getTronBalance = async ({ address, setBalance }: IBalanceObj) => {
  const tronWeb = (window as any).tronWeb;
  const tronBalance = await tronWeb.trx.getBalance(address);
  if (tronBalance) {
    const formatTronBalance = tronWeb.fromSun(tronBalance);
    setBalance &&
      formatTronBalance &&
      setBalance(parseFloat(formatTronBalance));
    return parseFloat(formatTronBalance);
  }
  return 0;
};

const getMetamaskBalance = async ({
  address,
  provider,
  setBalance,
}: IBalanceObj) => {
  const balance = await provider.getBalance(address);
  const intBalance = Number(ethers.utils.formatEther(balance.toString()));
  setBalance && intBalance && setBalance(intBalance);
  return intBalance;
};

const createTronContract = async ({
  _uri,
  abi,
  bytecode,
  setLoadingStep,
}: ICreateContractObj) => {
  const transaction = await (
    window as any
  ).tronWeb.transactionBuilder.createSmartContract(
    {
      abi,
      bytecode,
      feeLimit: 1e9,
      callValue: 0,
      userFeePercentage: 30,
      originEnergyLimit: 1e7,
      parameters: [_uri],
    },
    (window as any).tronWeb.defaultAddress.hex
  );
  const signedTransaction = await (window as any).tronWeb.trx.sign(transaction);
  setLoadingStep({ finishedStep: 1, loadingStep: 2 });
  const contract_instance = await (
    window as any
  ).tronWeb.trx.sendRawTransaction(signedTransaction);
  setLoadingStep({ finishedStep: 2 });

  if (contract_instance.transaction) {
    const contract_address = (window as any).tronWeb.address.fromHex(
      contract_instance.transaction.contract_address
    );
    return contract_address;
  } else if (contract_instance.code) {
    console.log(contract_instance);
    addErrorNotification(TRON_WALLET_ERR[contract_instance.code as tronErrors]);
    return null;
  }
};

const createMetamaskContract = async ({
  _uri,
  abi,
  bytecode,
  setLoadingStep,
}: ICreateContractObj) => {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const signer = provider.getSigner(0);
  setLoadingStep({ finishedStep: 1, loadingStep: 2 });
  const Badge = new ethers.ContractFactory(abi, bytecode, signer);
  const badgeContract = await Badge.deploy(_uri); // deploy contracts
  setLoadingStep({ finishedStep: 2 });
  return badgeContract.address;
};

interface IWalletsConf {
  [wallet: string]: {
    blockchains: {
      address: string;
      name: string;
      icon: string;
      chainId?: string;
      chainName?: string;
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
    abi_transfer?: any[];
    bytecode: string;
    getWalletData: (blockchainName?: string) => Promise<any>;
    paymentMethod: (objForPay: IPayObj) => Promise<any>;
    getBalance: (objForBalance: IBalanceObj) => Promise<number>;
    createContract: (
      objForContract: ICreateContractObj
    ) => Promise<string | null>;
  };
}

export const walletsConf: IWalletsConf = {
  tronlink: {
    blockchains: [
      {
        address: "TX6dd8YNKRCKZazcBZUHZQjyckzxvPKYJU",
        name: "tron",
        icon: tronlinkIcon,
        nativeCurrency: {
          name: "tron",
          symbol: "TRX",
        },
      },
    ],
    icon: tronlinkIcon,
    getWalletData: (blockchainName) => getTronWallet(blockchainName),
    paymentMethod: (objForPay) => payByTron({ ...objForPay }),
    getBalance: (objForBalance) => getTronBalance({ ...objForBalance }),
    createContract: (objForContract) =>
      createTronContract({ ...objForContract }),
    abi: [
      {
        inputs: [
          {
            internalType: "string",
            name: "_uri",
            type: "string",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
        ],
        name: "ApprovalForAll",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnershipTransferred",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]",
          },
          {
            indexed: false,
            internalType: "uint256[]",
            name: "values",
            type: "uint256[]",
          },
        ],
        name: "TransferBatch",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "TransferSingle",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "string",
            name: "value",
            type: "string",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
        ],
        name: "URI",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address[]",
            name: "accounts",
            type: "address[]",
          },
          {
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]",
          },
        ],
        name: "balanceOfBatch",
        outputs: [
          {
            internalType: "uint256[]",
            name: "",
            type: "uint256[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_amount",
            type: "uint256",
          },
        ],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
        ],
        name: "exists",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
        ],
        name: "isApprovedForAll",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "amounts",
            type: "uint256[]",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        name: "safeBatchTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "newuri",
            type: "string",
          },
        ],
        name: "setURI",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes4",
            name: "interfaceId",
            type: "bytes4",
          },
        ],
        name: "supportsInterface",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
        ],
        name: "totalSupply",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "uri",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    bytecode:
      "60806040523480156200001157600080fd5b50d380156200001f57600080fd5b50d280156200002d57600080fd5b5060405162003b4838038062003b488339818101604052810190620000539190620003a4565b604051806020016040528060008152506200007481620000ad60201b60201c565b506200009562000089620000c960201b60201c565b620000d160201b60201c565b620000a6816200019760201b60201c565b50620005fc565b8060029080519060200190620000c592919062000276565b5050565b600033905090565b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b620001a7620001bb60201b60201c565b620001b881620000ad60201b60201c565b50565b620001cb620000c960201b60201c565b73ffffffffffffffffffffffffffffffffffffffff16620001f16200024c60201b60201c565b73ffffffffffffffffffffffffffffffffffffffff16146200024a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040162000241906200041c565b60405180910390fd5b565b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b8280546200028490620004e4565b90600052602060002090601f016020900481019282620002a85760008555620002f4565b82601f10620002c357805160ff1916838001178555620002f4565b82800160010185558215620002f4579182015b82811115620002f3578251825591602001919060010190620002d6565b5b50905062000303919062000307565b5090565b5b808211156200032257600081600090555060010162000308565b5090565b60006200033d620003378462000467565b6200043e565b9050828152602081018484840111156200035c576200035b620005b3565b5b62000369848285620004ae565b509392505050565b600082601f830112620003895762000388620005ae565b5b81516200039b84826020860162000326565b91505092915050565b600060208284031215620003bd57620003bc620005bd565b5b600082015167ffffffffffffffff811115620003de57620003dd620005b8565b5b620003ec8482850162000371565b91505092915050565b6000620004046020836200049d565b91506200041182620005d3565b602082019050919050565b600060208201905081810360008301526200043781620003f5565b9050919050565b60006200044a6200045d565b90506200045882826200051a565b919050565b6000604051905090565b600067ffffffffffffffff8211156200048557620004846200057f565b5b6200049082620005c2565b9050602081019050919050565b600082825260208201905092915050565b60005b83811015620004ce578082015181840152602081019050620004b1565b83811115620004de576000848401525b50505050565b60006002820490506001821680620004fd57607f821691505b6020821081141562000514576200051362000550565b5b50919050565b6200052582620005c2565b810181811067ffffffffffffffff821117156200054757620005466200057f565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b61353c806200060c6000396000f3fe608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b50600436106101195760003560e01c8063715018a6116100b1578063bd85b03911610080578063bd85b039146102c2578063e985e9c5146102f2578063f242432a14610322578063f2fde38b1461033e57610119565b8063715018a6146102625780638da5cb5b1461026c578063a22cb4651461028a578063b390c0ab146102a657610119565b8063156e29f6116100ed578063156e29f6146101ca5780632eb2c2d6146101e65780634e1273f4146102025780634f558e791461023257610119565b8062fdd58e1461011e57806301ffc9a71461014e57806302fe53051461017e5780630e89341c1461019a575b600080fd5b61013860048036038101906101339190612278565b61035a565b6040516101459190612b17565b60405180910390f35b61016860048036038101906101639190612383565b610423565b60405161017591906128fa565b60405180910390f35b610198600480360381019061019391906123dd565b610505565b005b6101b460048036038101906101af9190612426565b610519565b6040516101c19190612915565b60405180910390f35b6101e460048036038101906101df91906122b8565b6105ad565b005b61020060048036038101906101fb91906120d2565b6105d5565b005b61021c6004803603810190610217919061230b565b610676565b60405161022991906128a1565b60405180910390f35b61024c60048036038101906102479190612426565b61078f565b60405161025991906128fa565b60405180910390f35b61026a6107a3565b005b6102746107b7565b60405161028191906127c4565b60405180910390f35b6102a4600480360381019061029f9190612238565b6107e1565b005b6102c060048036038101906102bb9190612453565b6107f7565b005b6102dc60048036038101906102d79190612426565b610806565b6040516102e99190612b17565b60405180910390f35b61030c60048036038101906103079190612092565b610823565b60405161031991906128fa565b60405180910390f35b61033c600480360381019061033791906121a1565b6108b7565b005b61035860048036038101906103539190612065565b610958565b005b60008073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156103cb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103c2906129d7565b60405180910390fd5b60008083815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b60007fd9b67a26000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806104ee57507f0e89341c000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b806104fe57506104fd826109dc565b5b9050919050565b61050d610a46565b61051681610ac4565b50565b60606002805461052890612dd8565b80601f016020809104026020016040519081016040528092919081815260200182805461055490612dd8565b80156105a15780601f10610576576101008083540402835291602001916105a1565b820191906000526020600020905b81548152906001019060200180831161058457829003601f168201915b50505050509050919050565b6105b5610a46565b6105d083838360405180602001604052806000815250610ade565b505050565b6105dd610c8f565b73ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff16148061062357506106228561061d610c8f565b610823565b5b610662576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161065990612957565b60405180910390fd5b61066f8585858585610c97565b5050505050565b606081518351146106bc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106b390612ab7565b60405180910390fd5b6000835167ffffffffffffffff8111156106d9576106d8612f11565b5b6040519080825280602002602001820160405280156107075781602001602082028036833780820191505090505b50905060005b84518110156107845761075485828151811061072c5761072b612ee2565b5b602002602001015185838151811061074757610746612ee2565b5b602002602001015161035a565b82828151811061076757610766612ee2565b5b6020026020010181815250508061077d90612e3b565b905061070d565b508091505092915050565b60008061079b83610806565b119050919050565b6107ab610a46565b6107b56000610fb9565b565b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6107f36107ec610c8f565b838361107f565b5050565b6108023383836111ec565b5050565b600060046000838152602001908152602001600020549050919050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b6108bf610c8f565b73ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1614806109055750610904856108ff610c8f565b610823565b5b610944576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161093b90612957565b60405180910390fd5b6109518585858585611433565b5050505050565b610960610a46565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156109d0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109c790612997565b60405180910390fd5b6109d981610fb9565b50565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b610a4e610c8f565b73ffffffffffffffffffffffffffffffffffffffff16610a6c6107b7565b73ffffffffffffffffffffffffffffffffffffffff1614610ac2576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ab990612a57565b60405180910390fd5b565b8060029080519060200190610ada929190611d32565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161415610b4e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b4590612af7565b60405180910390fd5b6000610b58610c8f565b90506000610b65856116cf565b90506000610b72856116cf565b9050610b8383600089858589611749565b8460008088815260200190815260200160002060008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610be29190612cab565b925050819055508673ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f628989604051610c60929190612b32565b60405180910390a4610c778360008985858961175f565b610c8683600089898989611767565b50505050505050565b600033905090565b8151835114610cdb576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610cd290612ad7565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161415610d4b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d42906129f7565b60405180910390fd5b6000610d55610c8f565b9050610d65818787878787611749565b60005b8451811015610f16576000858281518110610d8657610d85612ee2565b5b602002602001015190506000858381518110610da557610da4612ee2565b5b60200260200101519050600080600084815260200190815260200160002060008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610e46576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e3d90612a37565b60405180910390fd5b81810360008085815260200190815260200160002060008c73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508160008085815260200190815260200160002060008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610efb9190612cab565b9250508190555050505080610f0f90612e3b565b9050610d68565b508473ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8787604051610f8d9291906128c3565b60405180910390a4610fa381878787878761175f565b610fb181878787878761194e565b505050505050565b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156110ee576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110e590612a97565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31836040516111df91906128fa565b60405180910390a3505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141561125c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161125390612a17565b60405180910390fd5b6000611266610c8f565b90506000611273846116cf565b90506000611280846116cf565b90506112a083876000858560405180602001604052806000815250611749565b600080600087815260200190815260200160002060008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905084811015611337576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161132e906129b7565b60405180910390fd5b84810360008088815260200190815260200160002060008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550600073ffffffffffffffffffffffffffffffffffffffff168773ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff167fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f628989604051611404929190612b32565b60405180910390a461142a8488600086866040518060200160405280600081525061175f565b50505050505050565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614156114a3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161149a906129f7565b60405180910390fd5b60006114ad610c8f565b905060006114ba856116cf565b905060006114c7856116cf565b90506114d7838989858589611749565b600080600088815260200190815260200160002060008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508581101561156e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161156590612a37565b60405180910390fd5b85810360008089815260200190815260200160002060008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508560008089815260200190815260200160002060008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546116239190612cab565b925050819055508773ffffffffffffffffffffffffffffffffffffffff168973ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff167fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f628a8a6040516116a0929190612b32565b60405180910390a46116b6848a8a86868a61175f565b6116c4848a8a8a8a8a611767565b505050505050505050565b60606000600167ffffffffffffffff8111156116ee576116ed612f11565b5b60405190808252806020026020018201604052801561171c5781602001602082028036833780820191505090505b509050828160008151811061173457611733612ee2565b5b60200260200101818152505080915050919050565b611757868686868686611b35565b505050505050565b505050505050565b6117868473ffffffffffffffffffffffffffffffffffffffff16611d07565b15611946578373ffffffffffffffffffffffffffffffffffffffff1663f23a6e6187878686866040518663ffffffff1660e01b81526004016117cc959493929190612847565b602060405180830381600087803b1580156117e657600080fd5b505af192505050801561181757506040513d601f19601f8201168201806040525081019061181491906123b0565b60015b6118bd57611823612f40565b806308c379a014156118805750611838613414565b806118435750611882565b806040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016118779190612915565b60405180910390fd5b505b6040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016118b490612937565b60405180910390fd5b63f23a6e6160e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614611944576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161193b90612977565b60405180910390fd5b505b505050505050565b61196d8473ffffffffffffffffffffffffffffffffffffffff16611d07565b15611b2d578373ffffffffffffffffffffffffffffffffffffffff1663bc197c8187878686866040518663ffffffff1660e01b81526004016119b39594939291906127df565b602060405180830381600087803b1580156119cd57600080fd5b505af19250505080156119fe57506040513d601f19601f820116820180604052508101906119fb91906123b0565b60015b611aa457611a0a612f40565b806308c379a01415611a675750611a1f613414565b80611a2a5750611a69565b806040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a5e9190612915565b60405180910390fd5b505b6040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a9b90612937565b60405180910390fd5b63bc197c8160e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614611b2b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611b2290612977565b60405180910390fd5b505b505050505050565b611b43868686868686611d2a565b600073ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff161415611bf55760005b8351811015611bf357828181518110611b9757611b96612ee2565b5b602002602001015160046000868481518110611bb657611bb5612ee2565b5b602002602001015181526020019081526020016000206000828254611bdb9190612cab565b9250508190555080611bec90612e3b565b9050611b7b565b505b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161415611cff5760005b8351811015611cfd576000848281518110611c4b57611c4a612ee2565b5b602002602001015190506000848381518110611c6a57611c69612ee2565b5b6020026020010151905060006004600084815260200190815260200160002054905081811015611ccf576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611cc690612a77565b60405180910390fd5b818103600460008581526020019081526020016000208190555050505080611cf690612e3b565b9050611c2d565b505b505050505050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b505050505050565b828054611d3e90612dd8565b90600052602060002090601f016020900481019282611d605760008555611da7565b82601f10611d7957805160ff1916838001178555611da7565b82800160010185558215611da7579182015b82811115611da6578251825591602001919060010190611d8b565b5b509050611db49190611db8565b5090565b5b80821115611dd1576000816000905550600101611db9565b5090565b6000611de8611de384612b80565b612b5b565b90508083825260208201905082856020860282011115611e0b57611e0a612f67565b5b60005b85811015611e3b5781611e218882611f39565b845260208401935060208301925050600181019050611e0e565b5050509392505050565b6000611e58611e5384612bac565b612b5b565b90508083825260208201905082856020860282011115611e7b57611e7a612f67565b5b60005b85811015611eab5781611e918882612050565b845260208401935060208301925050600181019050611e7e565b5050509392505050565b6000611ec8611ec384612bd8565b612b5b565b905082815260208101848484011115611ee457611ee3612f6c565b5b611eef848285612d96565b509392505050565b6000611f0a611f0584612c09565b612b5b565b905082815260208101848484011115611f2657611f25612f6c565b5b611f31848285612d96565b509392505050565b600081359050611f48816134aa565b611f5181612d01565b905092915050565b600082601f830112611f6e57611f6d612f62565b5b8135611f7e848260208601611dd5565b91505092915050565b600082601f830112611f9c57611f9b612f62565b5b8135611fac848260208601611e45565b91505092915050565b600081359050611fc4816134c1565b92915050565b600081359050611fd9816134d8565b92915050565b600081519050611fee816134d8565b92915050565b600082601f83011261200957612008612f62565b5b8135612019848260208601611eb5565b91505092915050565b600082601f83011261203757612036612f62565b5b8135612047848260208601611ef7565b91505092915050565b60008135905061205f816134ef565b92915050565b60006020828403121561207b5761207a612f76565b5b600061208984828501611f39565b91505092915050565b600080604083850312156120a9576120a8612f76565b5b60006120b785828601611f39565b92505060206120c885828601611f39565b9150509250929050565b600080600080600060a086880312156120ee576120ed612f76565b5b60006120fc88828901611f39565b955050602061210d88828901611f39565b945050604086013567ffffffffffffffff81111561212e5761212d612f71565b5b61213a88828901611f87565b935050606086013567ffffffffffffffff81111561215b5761215a612f71565b5b61216788828901611f87565b925050608086013567ffffffffffffffff81111561218857612187612f71565b5b61219488828901611ff4565b9150509295509295909350565b600080600080600060a086880312156121bd576121bc612f76565b5b60006121cb88828901611f39565b95505060206121dc88828901611f39565b94505060406121ed88828901612050565b93505060606121fe88828901612050565b925050608086013567ffffffffffffffff81111561221f5761221e612f71565b5b61222b88828901611ff4565b9150509295509295909350565b6000806040838503121561224f5761224e612f76565b5b600061225d85828601611f39565b925050602061226e85828601611fb5565b9150509250929050565b6000806040838503121561228f5761228e612f76565b5b600061229d85828601611f39565b92505060206122ae85828601612050565b9150509250929050565b6000806000606084860312156122d1576122d0612f76565b5b60006122df86828701611f39565b93505060206122f086828701612050565b925050604061230186828701612050565b9150509250925092565b6000806040838503121561232257612321612f76565b5b600083013567ffffffffffffffff8111156123405761233f612f71565b5b61234c85828601611f59565b925050602083013567ffffffffffffffff81111561236d5761236c612f71565b5b61237985828601611f87565b9150509250929050565b60006020828403121561239957612398612f76565b5b60006123a784828501611fca565b91505092915050565b6000602082840312156123c6576123c5612f76565b5b60006123d484828501611fdf565b91505092915050565b6000602082840312156123f3576123f2612f76565b5b600082013567ffffffffffffffff81111561241157612410612f71565b5b61241d84828501612022565b91505092915050565b60006020828403121561243c5761243b612f76565b5b600061244a84828501612050565b91505092915050565b6000806040838503121561246a57612469612f76565b5b600061247885828601612050565b925050602061248985828601612050565b9150509250929050565b600061249f83836127a6565b60208301905092915050565b6124b481612d01565b82525050565b60006124c582612c4a565b6124cf8185612c78565b93506124da83612c3a565b8060005b8381101561250b5781516124f28882612493565b97506124fd83612c6b565b9250506001810190506124de565b5085935050505092915050565b61252181612d13565b82525050565b600061253282612c55565b61253c8185612c89565b935061254c818560208601612da5565b61255581612f7b565b840191505092915050565b600061256b82612c60565b6125758185612c9a565b9350612585818560208601612da5565b61258e81612f7b565b840191505092915050565b60006125a6603483612c9a565b91506125b182612f99565b604082019050919050565b60006125c9602f83612c9a565b91506125d482612fe8565b604082019050919050565b60006125ec602883612c9a565b91506125f782613037565b604082019050919050565b600061260f602683612c9a565b915061261a82613086565b604082019050919050565b6000612632602483612c9a565b915061263d826130d5565b604082019050919050565b6000612655602a83612c9a565b915061266082613124565b604082019050919050565b6000612678602583612c9a565b915061268382613173565b604082019050919050565b600061269b602383612c9a565b91506126a6826131c2565b604082019050919050565b60006126be602a83612c9a565b91506126c982613211565b604082019050919050565b60006126e1602083612c9a565b91506126ec82613260565b602082019050919050565b6000612704602883612c9a565b915061270f82613289565b604082019050919050565b6000612727602983612c9a565b9150612732826132d8565b604082019050919050565b600061274a602983612c9a565b915061275582613327565b604082019050919050565b600061276d602883612c9a565b915061277882613376565b604082019050919050565b6000612790602183612c9a565b915061279b826133c5565b604082019050919050565b6127af81612d8c565b82525050565b6127be81612d8c565b82525050565b60006020820190506127d960008301846124ab565b92915050565b600060a0820190506127f460008301886124ab565b61280160208301876124ab565b818103604083015261281381866124ba565b9050818103606083015261282781856124ba565b9050818103608083015261283b8184612527565b90509695505050505050565b600060a08201905061285c60008301886124ab565b61286960208301876124ab565b61287660408301866127b5565b61288360608301856127b5565b81810360808301526128958184612527565b90509695505050505050565b600060208201905081810360008301526128bb81846124ba565b905092915050565b600060408201905081810360008301526128dd81856124ba565b905081810360208301526128f181846124ba565b90509392505050565b600060208201905061290f6000830184612518565b92915050565b6000602082019050818103600083015261292f8184612560565b905092915050565b6000602082019050818103600083015261295081612599565b9050919050565b60006020820190508181036000830152612970816125bc565b9050919050565b60006020820190508181036000830152612990816125df565b9050919050565b600060208201905081810360008301526129b081612602565b9050919050565b600060208201905081810360008301526129d081612625565b9050919050565b600060208201905081810360008301526129f081612648565b9050919050565b60006020820190508181036000830152612a108161266b565b9050919050565b60006020820190508181036000830152612a308161268e565b9050919050565b60006020820190508181036000830152612a50816126b1565b9050919050565b60006020820190508181036000830152612a70816126d4565b9050919050565b60006020820190508181036000830152612a90816126f7565b9050919050565b60006020820190508181036000830152612ab08161271a565b9050919050565b60006020820190508181036000830152612ad08161273d565b9050919050565b60006020820190508181036000830152612af081612760565b9050919050565b60006020820190508181036000830152612b1081612783565b9050919050565b6000602082019050612b2c60008301846127b5565b92915050565b6000604082019050612b4760008301856127b5565b612b5460208301846127b5565b9392505050565b6000612b65612b76565b9050612b718282612e0a565b919050565b6000604051905090565b600067ffffffffffffffff821115612b9b57612b9a612f11565b5b602082029050602081019050919050565b600067ffffffffffffffff821115612bc757612bc6612f11565b5b602082029050602081019050919050565b600067ffffffffffffffff821115612bf357612bf2612f11565b5b612bfc82612f7b565b9050602081019050919050565b600067ffffffffffffffff821115612c2457612c23612f11565b5b612c2d82612f7b565b9050602081019050919050565b6000819050602082019050919050565b600081519050919050565b600081519050919050565b600081519050919050565b6000602082019050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600082825260208201905092915050565b6000612cb682612d8c565b9150612cc183612d8c565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115612cf657612cf5612e84565b5b828201905092915050565b6000612d0c82612d4b565b9050919050565b60008115159050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600074ffffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b83811015612dc3578082015181840152602081019050612da8565b83811115612dd2576000848401525b50505050565b60006002820490506001821680612df057607f821691505b60208210811415612e0457612e03612eb3565b5b50919050565b612e1382612f7b565b810181811067ffffffffffffffff82111715612e3257612e31612f11565b5b80604052505050565b6000612e4682612d8c565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415612e7957612e78612e84565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600060033d1115612f5f5760046000803e612f5c600051612f8c565b90505b90565b600080fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b60008160e01c9050919050565b7f455243313135353a207472616e7366657220746f206e6f6e204552433131353560008201527f526563656976657220696d706c656d656e746572000000000000000000000000602082015250565b7f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60008201527f6572206e6f7220617070726f7665640000000000000000000000000000000000602082015250565b7f455243313135353a204552433131353552656365697665722072656a6563746560008201527f6420746f6b656e73000000000000000000000000000000000000000000000000602082015250565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b7f455243313135353a206275726e20616d6f756e7420657863656564732062616c60008201527f616e636500000000000000000000000000000000000000000000000000000000602082015250565b7f455243313135353a2061646472657373207a65726f206973206e6f742061207660008201527f616c6964206f776e657200000000000000000000000000000000000000000000602082015250565b7f455243313135353a207472616e7366657220746f20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b7f455243313135353a206275726e2066726f6d20746865207a65726f206164647260008201527f6573730000000000000000000000000000000000000000000000000000000000602082015250565b7f455243313135353a20696e73756666696369656e742062616c616e636520666f60008201527f72207472616e7366657200000000000000000000000000000000000000000000602082015250565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b7f455243313135353a206275726e20616d6f756e74206578636565647320746f7460008201527f616c537570706c79000000000000000000000000000000000000000000000000602082015250565b7f455243313135353a2073657474696e6720617070726f76616c2073746174757360008201527f20666f722073656c660000000000000000000000000000000000000000000000602082015250565b7f455243313135353a206163636f756e747320616e6420696473206c656e67746860008201527f206d69736d617463680000000000000000000000000000000000000000000000602082015250565b7f455243313135353a2069647320616e6420616d6f756e7473206c656e6774682060008201527f6d69736d61746368000000000000000000000000000000000000000000000000602082015250565b7f455243313135353a206d696e7420746f20746865207a65726f2061646472657360008201527f7300000000000000000000000000000000000000000000000000000000000000602082015250565b600060443d1015613424576134a7565b61342c612b76565b60043d036004823e80513d602482011167ffffffffffffffff821117156134545750506134a7565b808201805167ffffffffffffffff81111561347257505050506134a7565b80602083010160043d03850181111561348f5750505050506134a7565b61349e82602001850186612e0a565b82955050505050505b90565b6134b381612d6b565b81146134be57600080fd5b50565b6134ca81612d13565b81146134d557600080fd5b50565b6134e181612d1f565b81146134ec57600080fd5b50565b6134f881612d8c565b811461350357600080fd5b5056fea26474726f6e5822122065e905522bc7ea1b80d84f4b873089d971064468686ea53ebd65284e967d626564736f6c63430008060033",
  },
  metamask: {
    blockchains: [
      {
        address: "0xeb9bab732b7C24428CC21DDB5Aed8F43209bDB37",
        name: "evmos",
        icon: evmosIcon,
        chainId: "0x2328", // 9000
        chainName: "Evmos Testnet",
        nativeCurrency: {
          name: "test-Evmos",
          symbol: "tEVMOS",
          decimals: 18,
        },
        rpcUrls: ["https://eth.bd.evmos.dev:8545"],
        blockExplorerUrls: ["https://evm.evmos.dev"],
      },
      {
        address: "0x2d6036bCd363bf720442455dd2FB942b70Ca6717",
        name: "klay-token",
        icon: klaytnIcon,
        chainId: "0x3e9", // 1001
        chainName: "Klaytn Testnet Baobab",
        nativeCurrency: {
          name: "KLAY",
          symbol: "KLAY",
          decimals: 18,
        },
        rpcUrls: ["https://api.baobab.klaytn.net:8651"],
        blockExplorerUrls: ["https://www.klaytn.com/"],
      },
    ],
    icon: metamaskIcon,
    getWalletData: (blockchainName) => getMetamaskData(blockchainName),
    paymentMethod: (objForPay) => payByMetamask({ ...objForPay }),
    getBalance: (objForBalance) => getMetamaskBalance({ ...objForBalance }),
    createContract: (objForContract) =>
      createMetamaskContract({ ...objForContract }),
    abi: [
      {
        inputs: [
          {
            internalType: "string",
            name: "_uri",
            type: "string",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
        ],
        name: "ApprovalForAll",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnershipTransferred",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]",
          },
          {
            indexed: false,
            internalType: "uint256[]",
            name: "values",
            type: "uint256[]",
          },
        ],
        name: "TransferBatch",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "TransferSingle",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "string",
            name: "value",
            type: "string",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
        ],
        name: "URI",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address[]",
            name: "accounts",
            type: "address[]",
          },
          {
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]",
          },
        ],
        name: "balanceOfBatch",
        outputs: [
          {
            internalType: "uint256[]",
            name: "",
            type: "uint256[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_amount",
            type: "uint256",
          },
        ],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
        ],
        name: "exists",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
        ],
        name: "isApprovedForAll",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "amounts",
            type: "uint256[]",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        name: "safeBatchTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "newuri",
            type: "string",
          },
        ],
        name: "setURI",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes4",
            name: "interfaceId",
            type: "bytes4",
          },
        ],
        name: "supportsInterface",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
        ],
        name: "totalSupply",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "uri",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    abi_transfer: [
      {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [
          {
            internalType: "address payable",
            name: "_creator",
            type: "address",
          },
        ],
        name: "transferMoney",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [],
        name: "withdrawPendingBalance",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        stateMutability: "payable",
        type: "receive",
      },
    ],
    bytecode:
      "60806040523480156200001157600080fd5b5060405162003ae638038062003ae6833981810160405281019062000037919062000388565b6040518060200160405280600081525062000058816200009160201b60201c565b50620000796200006d620000ad60201b60201c565b620000b560201b60201c565b6200008a816200017b60201b60201c565b50620005e0565b8060029080519060200190620000a99291906200025a565b5050565b600033905090565b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b6200018b6200019f60201b60201c565b6200019c816200009160201b60201c565b50565b620001af620000ad60201b60201c565b73ffffffffffffffffffffffffffffffffffffffff16620001d56200023060201b60201c565b73ffffffffffffffffffffffffffffffffffffffff16146200022e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620002259062000400565b60405180910390fd5b565b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b8280546200026890620004c8565b90600052602060002090601f0160209004810192826200028c5760008555620002d8565b82601f10620002a757805160ff1916838001178555620002d8565b82800160010185558215620002d8579182015b82811115620002d7578251825591602001919060010190620002ba565b5b509050620002e79190620002eb565b5090565b5b8082111562000306576000816000905550600101620002ec565b5090565b6000620003216200031b846200044b565b62000422565b90508281526020810184848401111562000340576200033f62000597565b5b6200034d84828562000492565b509392505050565b600082601f8301126200036d576200036c62000592565b5b81516200037f8482602086016200030a565b91505092915050565b600060208284031215620003a157620003a0620005a1565b5b600082015167ffffffffffffffff811115620003c257620003c16200059c565b5b620003d08482850162000355565b91505092915050565b6000620003e860208362000481565b9150620003f582620005b7565b602082019050919050565b600060208201905081810360008301526200041b81620003d9565b9050919050565b60006200042e62000441565b90506200043c8282620004fe565b919050565b6000604051905090565b600067ffffffffffffffff82111562000469576200046862000563565b5b6200047482620005a6565b9050602081019050919050565b600082825260208201905092915050565b60005b83811015620004b257808201518184015260208101905062000495565b83811115620004c2576000848401525b50505050565b60006002820490506001821680620004e157607f821691505b60208210811415620004f857620004f762000534565b5b50919050565b6200050982620005a6565b810181811067ffffffffffffffff821117156200052b576200052a62000563565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b6134f680620005f06000396000f3fe608060405234801561001057600080fd5b50600436106100ff5760003560e01c8063715018a611610097578063bd85b03911610066578063bd85b039146102a8578063e985e9c5146102d8578063f242432a14610308578063f2fde38b14610324576100ff565b8063715018a6146102485780638da5cb5b14610252578063a22cb46514610270578063b390c0ab1461028c576100ff565b8063156e29f6116100d3578063156e29f6146101b05780632eb2c2d6146101cc5780634e1273f4146101e85780634f558e7914610218576100ff565b8062fdd58e1461010457806301ffc9a71461013457806302fe5305146101645780630e89341c14610180575b600080fd5b61011e60048036038101906101199190612253565b610340565b60405161012b9190612af2565b60405180910390f35b61014e6004803603810190610149919061235e565b610409565b60405161015b91906128d5565b60405180910390f35b61017e600480360381019061017991906123b8565b6104eb565b005b61019a60048036038101906101959190612401565b6104ff565b6040516101a791906128f0565b60405180910390f35b6101ca60048036038101906101c59190612293565b610593565b005b6101e660048036038101906101e191906120ad565b6105bb565b005b61020260048036038101906101fd91906122e6565b61065c565b60405161020f919061287c565b60405180910390f35b610232600480360381019061022d9190612401565b610775565b60405161023f91906128d5565b60405180910390f35b610250610789565b005b61025a61079d565b604051610267919061279f565b60405180910390f35b61028a60048036038101906102859190612213565b6107c7565b005b6102a660048036038101906102a1919061242e565b6107dd565b005b6102c260048036038101906102bd9190612401565b6107ec565b6040516102cf9190612af2565b60405180910390f35b6102f260048036038101906102ed919061206d565b610809565b6040516102ff91906128d5565b60405180910390f35b610322600480360381019061031d919061217c565b61089d565b005b61033e60048036038101906103399190612040565b61093e565b005b60008073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156103b1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103a8906129b2565b60405180910390fd5b60008083815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b60007fd9b67a26000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806104d457507f0e89341c000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b806104e457506104e3826109c2565b5b9050919050565b6104f3610a2c565b6104fc81610aaa565b50565b60606002805461050e90612d92565b80601f016020809104026020016040519081016040528092919081815260200182805461053a90612d92565b80156105875780601f1061055c57610100808354040283529160200191610587565b820191906000526020600020905b81548152906001019060200180831161056a57829003601f168201915b50505050509050919050565b61059b610a2c565b6105b683838360405180602001604052806000815250610ac4565b505050565b6105c3610c75565b73ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff161480610609575061060885610603610c75565b610809565b5b610648576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161063f90612932565b60405180910390fd5b6106558585858585610c7d565b5050505050565b606081518351146106a2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161069990612a92565b60405180910390fd5b6000835167ffffffffffffffff8111156106bf576106be612ecb565b5b6040519080825280602002602001820160405280156106ed5781602001602082028036833780820191505090505b50905060005b845181101561076a5761073a85828151811061071257610711612e9c565b5b602002602001015185838151811061072d5761072c612e9c565b5b6020026020010151610340565b82828151811061074d5761074c612e9c565b5b6020026020010181815250508061076390612df5565b90506106f3565b508091505092915050565b600080610781836107ec565b119050919050565b610791610a2c565b61079b6000610f9f565b565b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6107d96107d2610c75565b8383611065565b5050565b6107e83383836111d2565b5050565b600060046000838152602001908152602001600020549050919050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b6108a5610c75565b73ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1614806108eb57506108ea856108e5610c75565b610809565b5b61092a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161092190612932565b60405180910390fd5b6109378585858585611419565b5050505050565b610946610a2c565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156109b6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109ad90612972565b60405180910390fd5b6109bf81610f9f565b50565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b610a34610c75565b73ffffffffffffffffffffffffffffffffffffffff16610a5261079d565b73ffffffffffffffffffffffffffffffffffffffff1614610aa8576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a9f90612a32565b60405180910390fd5b565b8060029080519060200190610ac0929190611d18565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161415610b34576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b2b90612ad2565b60405180910390fd5b6000610b3e610c75565b90506000610b4b856116b5565b90506000610b58856116b5565b9050610b698360008985858961172f565b8460008088815260200190815260200160002060008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610bc89190612c86565b925050819055508673ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f628989604051610c46929190612b0d565b60405180910390a4610c5d83600089858589611745565b610c6c8360008989898961174d565b50505050505050565b600033905090565b8151835114610cc1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610cb890612ab2565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161415610d31576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d28906129d2565b60405180910390fd5b6000610d3b610c75565b9050610d4b81878787878761172f565b60005b8451811015610efc576000858281518110610d6c57610d6b612e9c565b5b602002602001015190506000858381518110610d8b57610d8a612e9c565b5b60200260200101519050600080600084815260200190815260200160002060008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610e2c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e2390612a12565b60405180910390fd5b81810360008085815260200190815260200160002060008c73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508160008085815260200190815260200160002060008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610ee19190612c86565b9250508190555050505080610ef590612df5565b9050610d4e565b508473ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8787604051610f7392919061289e565b60405180910390a4610f89818787878787611745565b610f97818787878787611934565b505050505050565b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156110d4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110cb90612a72565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31836040516111c591906128d5565b60405180910390a3505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415611242576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611239906129f2565b60405180910390fd5b600061124c610c75565b90506000611259846116b5565b90506000611266846116b5565b90506112868387600085856040518060200160405280600081525061172f565b600080600087815260200190815260200160002060008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508481101561131d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161131490612992565b60405180910390fd5b84810360008088815260200190815260200160002060008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550600073ffffffffffffffffffffffffffffffffffffffff168773ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff167fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f6289896040516113ea929190612b0d565b60405180910390a461141084886000868660405180602001604052806000815250611745565b50505050505050565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161415611489576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611480906129d2565b60405180910390fd5b6000611493610c75565b905060006114a0856116b5565b905060006114ad856116b5565b90506114bd83898985858961172f565b600080600088815260200190815260200160002060008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905085811015611554576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161154b90612a12565b60405180910390fd5b85810360008089815260200190815260200160002060008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508560008089815260200190815260200160002060008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546116099190612c86565b925050819055508773ffffffffffffffffffffffffffffffffffffffff168973ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff167fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f628a8a604051611686929190612b0d565b60405180910390a461169c848a8a86868a611745565b6116aa848a8a8a8a8a61174d565b505050505050505050565b60606000600167ffffffffffffffff8111156116d4576116d3612ecb565b5b6040519080825280602002602001820160405280156117025781602001602082028036833780820191505090505b509050828160008151811061171a57611719612e9c565b5b60200260200101818152505080915050919050565b61173d868686868686611b1b565b505050505050565b505050505050565b61176c8473ffffffffffffffffffffffffffffffffffffffff16611ced565b1561192c578373ffffffffffffffffffffffffffffffffffffffff1663f23a6e6187878686866040518663ffffffff1660e01b81526004016117b2959493929190612822565b602060405180830381600087803b1580156117cc57600080fd5b505af19250505080156117fd57506040513d601f19601f820116820180604052508101906117fa919061238b565b60015b6118a357611809612efa565b806308c379a01415611866575061181e6133ce565b806118295750611868565b806040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161185d91906128f0565b60405180910390fd5b505b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161189a90612912565b60405180910390fd5b63f23a6e6160e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161461192a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161192190612952565b60405180910390fd5b505b505050505050565b6119538473ffffffffffffffffffffffffffffffffffffffff16611ced565b15611b13578373ffffffffffffffffffffffffffffffffffffffff1663bc197c8187878686866040518663ffffffff1660e01b81526004016119999594939291906127ba565b602060405180830381600087803b1580156119b357600080fd5b505af19250505080156119e457506040513d601f19601f820116820180604052508101906119e1919061238b565b60015b611a8a576119f0612efa565b806308c379a01415611a4d5750611a056133ce565b80611a105750611a4f565b806040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a4491906128f0565b60405180910390fd5b505b6040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a8190612912565b60405180910390fd5b63bc197c8160e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614611b11576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611b0890612952565b60405180910390fd5b505b505050505050565b611b29868686868686611d10565b600073ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff161415611bdb5760005b8351811015611bd957828181518110611b7d57611b7c612e9c565b5b602002602001015160046000868481518110611b9c57611b9b612e9c565b5b602002602001015181526020019081526020016000206000828254611bc19190612c86565b9250508190555080611bd290612df5565b9050611b61565b505b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161415611ce55760005b8351811015611ce3576000848281518110611c3157611c30612e9c565b5b602002602001015190506000848381518110611c5057611c4f612e9c565b5b6020026020010151905060006004600084815260200190815260200160002054905081811015611cb5576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611cac90612a52565b60405180910390fd5b818103600460008581526020019081526020016000208190555050505080611cdc90612df5565b9050611c13565b505b505050505050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b505050505050565b828054611d2490612d92565b90600052602060002090601f016020900481019282611d465760008555611d8d565b82601f10611d5f57805160ff1916838001178555611d8d565b82800160010185558215611d8d579182015b82811115611d8c578251825591602001919060010190611d71565b5b509050611d9a9190611d9e565b5090565b5b80821115611db7576000816000905550600101611d9f565b5090565b6000611dce611dc984612b5b565b612b36565b90508083825260208201905082856020860282011115611df157611df0612f21565b5b60005b85811015611e215781611e078882611f1f565b845260208401935060208301925050600181019050611df4565b5050509392505050565b6000611e3e611e3984612b87565b612b36565b90508083825260208201905082856020860282011115611e6157611e60612f21565b5b60005b85811015611e915781611e77888261202b565b845260208401935060208301925050600181019050611e64565b5050509392505050565b6000611eae611ea984612bb3565b612b36565b905082815260208101848484011115611eca57611ec9612f26565b5b611ed5848285612d50565b509392505050565b6000611ef0611eeb84612be4565b612b36565b905082815260208101848484011115611f0c57611f0b612f26565b5b611f17848285612d50565b509392505050565b600081359050611f2e81613464565b92915050565b600082601f830112611f4957611f48612f1c565b5b8135611f59848260208601611dbb565b91505092915050565b600082601f830112611f7757611f76612f1c565b5b8135611f87848260208601611e2b565b91505092915050565b600081359050611f9f8161347b565b92915050565b600081359050611fb481613492565b92915050565b600081519050611fc981613492565b92915050565b600082601f830112611fe457611fe3612f1c565b5b8135611ff4848260208601611e9b565b91505092915050565b600082601f83011261201257612011612f1c565b5b8135612022848260208601611edd565b91505092915050565b60008135905061203a816134a9565b92915050565b60006020828403121561205657612055612f30565b5b600061206484828501611f1f565b91505092915050565b6000806040838503121561208457612083612f30565b5b600061209285828601611f1f565b92505060206120a385828601611f1f565b9150509250929050565b600080600080600060a086880312156120c9576120c8612f30565b5b60006120d788828901611f1f565b95505060206120e888828901611f1f565b945050604086013567ffffffffffffffff81111561210957612108612f2b565b5b61211588828901611f62565b935050606086013567ffffffffffffffff81111561213657612135612f2b565b5b61214288828901611f62565b925050608086013567ffffffffffffffff81111561216357612162612f2b565b5b61216f88828901611fcf565b9150509295509295909350565b600080600080600060a0868803121561219857612197612f30565b5b60006121a688828901611f1f565b95505060206121b788828901611f1f565b94505060406121c88882890161202b565b93505060606121d98882890161202b565b925050608086013567ffffffffffffffff8111156121fa576121f9612f2b565b5b61220688828901611fcf565b9150509295509295909350565b6000806040838503121561222a57612229612f30565b5b600061223885828601611f1f565b925050602061224985828601611f90565b9150509250929050565b6000806040838503121561226a57612269612f30565b5b600061227885828601611f1f565b92505060206122898582860161202b565b9150509250929050565b6000806000606084860312156122ac576122ab612f30565b5b60006122ba86828701611f1f565b93505060206122cb8682870161202b565b92505060406122dc8682870161202b565b9150509250925092565b600080604083850312156122fd576122fc612f30565b5b600083013567ffffffffffffffff81111561231b5761231a612f2b565b5b61232785828601611f34565b925050602083013567ffffffffffffffff81111561234857612347612f2b565b5b61235485828601611f62565b9150509250929050565b60006020828403121561237457612373612f30565b5b600061238284828501611fa5565b91505092915050565b6000602082840312156123a1576123a0612f30565b5b60006123af84828501611fba565b91505092915050565b6000602082840312156123ce576123cd612f30565b5b600082013567ffffffffffffffff8111156123ec576123eb612f2b565b5b6123f884828501611ffd565b91505092915050565b60006020828403121561241757612416612f30565b5b60006124258482850161202b565b91505092915050565b6000806040838503121561244557612444612f30565b5b60006124538582860161202b565b92505060206124648582860161202b565b9150509250929050565b600061247a8383612781565b60208301905092915050565b61248f81612cdc565b82525050565b60006124a082612c25565b6124aa8185612c53565b93506124b583612c15565b8060005b838110156124e65781516124cd888261246e565b97506124d883612c46565b9250506001810190506124b9565b5085935050505092915050565b6124fc81612cee565b82525050565b600061250d82612c30565b6125178185612c64565b9350612527818560208601612d5f565b61253081612f35565b840191505092915050565b600061254682612c3b565b6125508185612c75565b9350612560818560208601612d5f565b61256981612f35565b840191505092915050565b6000612581603483612c75565b915061258c82612f53565b604082019050919050565b60006125a4602f83612c75565b91506125af82612fa2565b604082019050919050565b60006125c7602883612c75565b91506125d282612ff1565b604082019050919050565b60006125ea602683612c75565b91506125f582613040565b604082019050919050565b600061260d602483612c75565b91506126188261308f565b604082019050919050565b6000612630602a83612c75565b915061263b826130de565b604082019050919050565b6000612653602583612c75565b915061265e8261312d565b604082019050919050565b6000612676602383612c75565b91506126818261317c565b604082019050919050565b6000612699602a83612c75565b91506126a4826131cb565b604082019050919050565b60006126bc602083612c75565b91506126c78261321a565b602082019050919050565b60006126df602883612c75565b91506126ea82613243565b604082019050919050565b6000612702602983612c75565b915061270d82613292565b604082019050919050565b6000612725602983612c75565b9150612730826132e1565b604082019050919050565b6000612748602883612c75565b915061275382613330565b604082019050919050565b600061276b602183612c75565b91506127768261337f565b604082019050919050565b61278a81612d46565b82525050565b61279981612d46565b82525050565b60006020820190506127b46000830184612486565b92915050565b600060a0820190506127cf6000830188612486565b6127dc6020830187612486565b81810360408301526127ee8186612495565b905081810360608301526128028185612495565b905081810360808301526128168184612502565b90509695505050505050565b600060a0820190506128376000830188612486565b6128446020830187612486565b6128516040830186612790565b61285e6060830185612790565b81810360808301526128708184612502565b90509695505050505050565b600060208201905081810360008301526128968184612495565b905092915050565b600060408201905081810360008301526128b88185612495565b905081810360208301526128cc8184612495565b90509392505050565b60006020820190506128ea60008301846124f3565b92915050565b6000602082019050818103600083015261290a818461253b565b905092915050565b6000602082019050818103600083015261292b81612574565b9050919050565b6000602082019050818103600083015261294b81612597565b9050919050565b6000602082019050818103600083015261296b816125ba565b9050919050565b6000602082019050818103600083015261298b816125dd565b9050919050565b600060208201905081810360008301526129ab81612600565b9050919050565b600060208201905081810360008301526129cb81612623565b9050919050565b600060208201905081810360008301526129eb81612646565b9050919050565b60006020820190508181036000830152612a0b81612669565b9050919050565b60006020820190508181036000830152612a2b8161268c565b9050919050565b60006020820190508181036000830152612a4b816126af565b9050919050565b60006020820190508181036000830152612a6b816126d2565b9050919050565b60006020820190508181036000830152612a8b816126f5565b9050919050565b60006020820190508181036000830152612aab81612718565b9050919050565b60006020820190508181036000830152612acb8161273b565b9050919050565b60006020820190508181036000830152612aeb8161275e565b9050919050565b6000602082019050612b076000830184612790565b92915050565b6000604082019050612b226000830185612790565b612b2f6020830184612790565b9392505050565b6000612b40612b51565b9050612b4c8282612dc4565b919050565b6000604051905090565b600067ffffffffffffffff821115612b7657612b75612ecb565b5b602082029050602081019050919050565b600067ffffffffffffffff821115612ba257612ba1612ecb565b5b602082029050602081019050919050565b600067ffffffffffffffff821115612bce57612bcd612ecb565b5b612bd782612f35565b9050602081019050919050565b600067ffffffffffffffff821115612bff57612bfe612ecb565b5b612c0882612f35565b9050602081019050919050565b6000819050602082019050919050565b600081519050919050565b600081519050919050565b600081519050919050565b6000602082019050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600082825260208201905092915050565b6000612c9182612d46565b9150612c9c83612d46565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115612cd157612cd0612e3e565b5b828201905092915050565b6000612ce782612d26565b9050919050565b60008115159050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b83811015612d7d578082015181840152602081019050612d62565b83811115612d8c576000848401525b50505050565b60006002820490506001821680612daa57607f821691505b60208210811415612dbe57612dbd612e6d565b5b50919050565b612dcd82612f35565b810181811067ffffffffffffffff82111715612dec57612deb612ecb565b5b80604052505050565b6000612e0082612d46565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415612e3357612e32612e3e565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600060033d1115612f195760046000803e612f16600051612f46565b90505b90565b600080fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b60008160e01c9050919050565b7f455243313135353a207472616e7366657220746f206e6f6e204552433131353560008201527f526563656976657220696d706c656d656e746572000000000000000000000000602082015250565b7f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60008201527f6572206e6f7220617070726f7665640000000000000000000000000000000000602082015250565b7f455243313135353a204552433131353552656365697665722072656a6563746560008201527f6420746f6b656e73000000000000000000000000000000000000000000000000602082015250565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b7f455243313135353a206275726e20616d6f756e7420657863656564732062616c60008201527f616e636500000000000000000000000000000000000000000000000000000000602082015250565b7f455243313135353a2061646472657373207a65726f206973206e6f742061207660008201527f616c6964206f776e657200000000000000000000000000000000000000000000602082015250565b7f455243313135353a207472616e7366657220746f20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b7f455243313135353a206275726e2066726f6d20746865207a65726f206164647260008201527f6573730000000000000000000000000000000000000000000000000000000000602082015250565b7f455243313135353a20696e73756666696369656e742062616c616e636520666f60008201527f72207472616e7366657200000000000000000000000000000000000000000000602082015250565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b7f455243313135353a206275726e20616d6f756e74206578636565647320746f7460008201527f616c537570706c79000000000000000000000000000000000000000000000000602082015250565b7f455243313135353a2073657474696e6720617070726f76616c2073746174757360008201527f20666f722073656c660000000000000000000000000000000000000000000000602082015250565b7f455243313135353a206163636f756e747320616e6420696473206c656e67746860008201527f206d69736d617463680000000000000000000000000000000000000000000000602082015250565b7f455243313135353a2069647320616e6420616d6f756e7473206c656e6774682060008201527f6d69736d61746368000000000000000000000000000000000000000000000000602082015250565b7f455243313135353a206d696e7420746f20746865207a65726f2061646472657360008201527f7300000000000000000000000000000000000000000000000000000000000000602082015250565b600060443d10156133de57613461565b6133e6612b51565b60043d036004823e80513d602482011167ffffffffffffffff8211171561340e575050613461565b808201805167ffffffffffffffff81111561342c5750505050613461565b80602083010160043d038501811115613449575050505050613461565b61345882602001850186612dc4565b82955050505050505b90565b61346d81612cdc565b811461347857600080fd5b50565b61348481612cee565b811461348f57600080fd5b50565b61349b81612cfa565b81146134a657600080fd5b50565b6134b281612d46565b81146134bd57600080fd5b5056fea26469706673582212205cd3711bd94e722e599ae1e7876523bde52f54c94edaf2d8563d5789269ebd0064736f6c63430008070033",
  },
};

export const currBlockchain = walletsConf[
  process.env.REACT_APP_WALLET || "metamask"
].blockchains.find((b) => b.name === process.env.REACT_APP_BLOCKCHAIN);
