type blockchainNetworks =
	//  prod
	| 'homestead' // ETH
	| 'bsc' // BNB
	| 'avalanche' // AVAX
	| 'evmos' // EVMOS
	| 'matic' // MATIC

	// dev
	| 'arbitrum-goerli' // ETH
	| 'bsc-testnet' // tBNB
	| 'avalanche-fuji' // AVAX
	| 'evmos-testnet' // EVMOS
	| 'maticmum' // MATIC

type blockchainNames =
	//  prod
	| 'Ethereum'
	| 'BNB Smart Chain'
	| 'Avalanche'
	| 'Evmos'
	| 'Polygon'

	// dev
	| 'Evmos Testnet'
	| 'Arbitrum Goerli'
	| 'Binance Smart Chain Testnet'
	| 'Avalanche Fuji'
	| 'Polygon Mumbai'

enum BlockchainsSymbols {
	ETH = 'ETH',
	BNB = 'BNB',
	tBNB = 'tBNB',
	AVAX = 'AVAX',
	EVMOS = 'EVMOS',
	MATIC = 'MATIC',
}

enum ExchangeNames {
	ETH = 'ethereum',
	BNB = 'binancecoin',
	tBNB = 'binancecoin',
	AVAX = 'avalanche-2',
	EVMOS = 'evmos',
	MATIC = 'matic-network',
}

type blockchainsType = keyof typeof ExchangeNames
type blockchainsSymbols = keyof typeof BlockchainsSymbols

export { ExchangeNames, BlockchainsSymbols }

export type { blockchainNetworks, blockchainsType, blockchainsSymbols, blockchainNames }
