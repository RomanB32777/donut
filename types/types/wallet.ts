type blockchainsType =
  | "evmos"
  | "klay"
  | "usdt"
  | "eth"
  | "bnb"
  | "avax"
  | "usdc"
  | "matic";
type exchangeNameTypes =
  | "evmos" // evmos
  | "klay-token" // klay
  | "tether" // usdt
  | "ethereum" // eth
  | "binancecoin" // bnb
  | "avalanche-2" // avax
  | "usd-coin" // usdc
  | "matic-network"; // matic

export type { blockchainsType, exchangeNameTypes };
