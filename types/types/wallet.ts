enum BlockchainsTypesEnum {
  evmos = "evmos",
  klay = "klay-token",
  usdt = "tether",
  eth = "ethereum",
  bnb = "binancecoin",
  avax = "avalanche-2",
  usdc = "usd-coin",
  polygon = "matic-network",
}

type blockchainsType =
  | "evmos"
  | "klay"
  | "usdt"
  | "eth"
  | "bnb"
  | "avax"
  | "usdc"
  | "polygon";

type exchangeNameTypes =
  | "evmos" // evmos
  | "klay-token" // klay
  | "tether" // usdt
  | "ethereum" // eth
  | "binancecoin" // bnb
  | "avalanche-2" // avax
  | "usd-coin" // usdc
  | "matic-network"; // matic

type blockchainsSymbols = "KLAY" | "ETHs" | "AGOR" | "tBNB" | "AVAX" | "MATIC";

type BlockchainNameToExchangeName = {
  [key in blockchainsSymbols]: exchangeNameTypes;
};

export type {
  blockchainsType,
  exchangeNameTypes,
  blockchainsSymbols,
  BlockchainNameToExchangeName,
};
