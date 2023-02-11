enum BlockchainsTypesEnum {
  usdt = "tether",
  eth = "ethereum",
  bnb = "binancecoin",
  avax = "avalanche-2",
  usdc = "usd-coin",
  polygon = "matic-network",
}

type blockchainsType = "usdt" | "eth" | "bnb" | "avax" | "usdc" | "polygon";

type exchangeNameTypes =
  | "tether" // usdt
  | "ethereum" // eth
  | "binancecoin" // bnb
  | "avalanche-2" // avax
  | "usd-coin" // usdc
  | "matic-network"; // matic

type blockchainsSymbols = "AGOR" | "BNB" | "AVAX" | "MATIC";

type BlockchainNameToExchangeName = {
  [key in blockchainsSymbols]: exchangeNameTypes;
};

export type {
  blockchainsType,
  exchangeNameTypes,
  blockchainsSymbols,
  BlockchainNameToExchangeName,
};
