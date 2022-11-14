import { addErrorNotification } from "./../notifications";
import {
  IBalanceObj,
  ICreateContractObj,
  IPayObj,
  IWalletConf,
  IMintBadgeObj,
  IQuantityBalanceObj,
} from "./types";
import {
  addAuthWalletNotification,
  addInstallWalletNotification,
} from "../../utils";
import { fromHexToString } from "../stringMethods";
import tronlinkIcon from "../../assets/tronlinkIcon.png";

// enum TRON_WALLET_ERR {
//   BANDWITH_ERROR = "There is not enough bandwidth or TRX to burn to send a transaction.",
//   SIGERROR = "Signature error",
//   CONTRACT_VALIDATE_ERROR = "Contract validate error",
// }

const getTronWallet = (blockchainName?: any) =>
  new Promise((resolve) => {
    setTimeout(async () => {
      if ((window as any).tronWeb) {
        if ((window as any).tronWeb.defaultAddress.base58)
          resolve({ address: (window as any).tronWeb.defaultAddress.base58 });
        else {
          addAuthWalletNotification("Tronlink");
          const currBlock = await (window as any).tronWeb.trx.getCurrentBlock();
          currBlock && currBlock.blockID
            ? resolve({
                address: (window as any).tronWeb.defaultAddress.base58,
              })
            : resolve(null);
        }
      } else
        addInstallWalletNotification(
          "TronLink",
          "https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec"
        );
      resolve(null);
    }, 500);
  });

const payByTron = async ({ contract, addressTo, sum }: IPayObj) => {
  let instance = await (window as any).tronWeb.contract().at(contract);
  const res = await instance.transferMoney(addressTo).send({
    feeLimit: 100_000_000,
    callValue: 1000000 * parseFloat(sum),
    shouldPollResponse: false,
  });
  return res;
};

const getTronBalance = async ({ walletData, setBalance }: IBalanceObj) => {
  const tronWeb = (window as any).tronWeb;
  const tronBalance = await tronWeb.trx.getBalance(walletData.address);
  if (tronBalance) {
    const formatTronBalance = tronWeb.fromSun(tronBalance);
    setBalance &&
      formatTronBalance &&
      setBalance(parseFloat(formatTronBalance));
    return parseFloat(formatTronBalance);
  }
  return 0;
};

const getTronTransactionInfo = async (hash: string) => {
  const transactionResult = await (
    window as any
  ).tronWeb.trx.getTransactionInfo(hash);
  if (transactionResult) return transactionResult;
  return null;
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
      feeLimit: 1000000000,
      callValue: 0,
      userFeePercentage: 30,
      originEnergyLimit: 1e7,
      parameters: [_uri],
    },
    (window as any).tronWeb.defaultAddress.hex
  );

  console.log("transaction", transaction);

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
    const transactionHashID = contract_instance.transaction.txID;

    const transactionInfo = await (
      window as any
    ).tronWeb.trx.getTransactionInfo(transactionHashID);

    if (transactionInfo?.__payload__) {
      const hash = transactionInfo.__payload__?.value;
      return { transaction_hash: hash || "", contract_address };
    } else return { contract_address };
  } else if (contract_instance.code) {
    const message = fromHexToString(contract_instance.message); // txid
    addErrorNotification({ message });
    // TRON_WALLET_ERR[contract_instance.code as keyof typeof TRON_WALLET_ERR]
    // TRON_WALLET_ERR[contract_instance.code as tronErrors]);
    return null;
  }
};

const getBadgeURITron = async (
  contract_address: string,
  walletConf: IWalletConf
) => {
  const { abi } = walletConf;
  if (abi) {
    const instance = await (window as any).tronWeb.contract(
      abi,
      contract_address
    );

    const getURInew = await instance.uri(1).call();
    return getURInew;
  }
  return "";
};

const mintBadgeTron = async (mintObj: IMintBadgeObj) => {
  const { contract_address, addressTo } = mintObj;
  const instance = await (window as any).tronWeb
    .contract()
    .at(contract_address);
  await instance.mint(addressTo, 1, 1).send({
    feeLimit: 100_000_000,
    callValue: 0,
    shouldPollResponse: true,
  });
};

const getQuantityBalanceTron = async (
  objForQuantityBalance: IQuantityBalanceObj,
  walletConf: IWalletConf
) => {
  const { abi } = walletConf;
  if (abi) {
    const { supporter_address, contract_address, isCreator } =
      objForQuantityBalance;
    const instance = await (window as any).tronWeb.contract(
      abi,
      contract_address
    );
    const balanceToken = isCreator
      ? await instance.totalSupply(1).call()
      : await instance.balanceOf(supporter_address, 1).call();
    return balanceToken.toNumber();
  }
  return null;
};

const tronAbi =
  '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address payable","name":"_streamer","type":"address"}],"name":"transferMoney","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}]';

const tronlinkConf: IWalletConf = {
  blockchains: [
    {
      address: "TAke85ayaVdsymmUjoaMC3w25zsQfQA7vk",
      name: "tron",
      icon: tronlinkIcon,
      chainName: "Tron Nile Testnet",
      badgeName: "Tron",
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
  createContract: (objForContract) => createTronContract({ ...objForContract }),
  getBadgeURI(contract_address) {
    return getBadgeURITron(contract_address, this);
  },
  mintBadge(objForBadge) {
    return mintBadgeTron(objForBadge);
  },
  getQuantityBalance(objForQuantityBalance) {
    return getQuantityBalanceTron(objForQuantityBalance, this);
  },
  getTransactionInfo: (hash) => getTronTransactionInfo(hash),
  abi: JSON.parse(tronAbi),
  bytecode:
    "608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506103e78061007a6000396000f3fe6080604052600436106100225760003560e01c806386ce98351461002e57610029565b3661002957005b600080fd5b610048600480360381019061004391906101a5565b61004a565b005b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc60646001346100939190610257565b61009d9190610226565b9081150290604051600060405180830381858888f193505050506100f6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100ed906101f5565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff166108fc606460633461011f9190610257565b6101299190610226565b9081150290604051600060405180830381858888f19350505050610182576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610179906101f5565b60405180910390fd5b50565b6000813590506101948161039a565b61019d816102b1565b905092915050565b6000602082840312156101bb576101ba61036c565b5b60006101c984828501610185565b91505092915050565b60006101df601183610215565b91506101ea82610371565b602082019050919050565b6000602082019050818103600083015261020e816101d2565b9050919050565b600082825260208201905092915050565b600061023182610304565b915061023c83610304565b92508261024c5761024b61033d565b5b828204905092915050565b600061026282610304565b915061026d83610304565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04831182151516156102a6576102a561030e565b5b828202905092915050565b60006102bc826102c3565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600074ffffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b600080fd5b7f4572726f722e2054727920616761696e21000000000000000000000000000000600082015250565b6103a3816102e3565b81146103ae57600080fd5b5056fea26474726f6e58221220f3b700839917c4891983868e350050617c55f853064279888a7fe401cec6565664736f6c63430008060033",
};

export default tronlinkConf;
