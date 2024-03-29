import { configureChains, createClient } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { publicProvider } from 'wagmi/providers/public'
import {
	Chain,
	mainnet,
	avalanche,
	bsc,
	polygon,
	evmosTestnet,
	bscTestnet,
	arbitrumGoerli,
	avalancheFuji,
	polygonMumbai,
} from 'wagmi/chains'
import { ExchangeNames } from 'types'

import metamaskIcon from 'assets/metamask.png'
import walletConnectIcon from 'assets/walletConnect.png'
import coinbaseWalletIcon from 'assets/coinbaseWallet.png'

import evmosIcon from 'assets/blockchains/evmos.png'
import ethIcon from 'assets/blockchains/eth.png'
import maticIcon from 'assets/blockchains/matic.png'
import bnbIcon from 'assets/blockchains/bnb.png'
import avaxIcon from 'assets/blockchains/avax.png'

const prodChains = [mainnet, bsc, avalanche, polygon]
const testChains = [evmosTestnet, arbitrumGoerli, bscTestnet, avalancheFuji, polygonMumbai]

const { chains, provider, webSocketProvider } = configureChains(
	[...(process.env.NODE_ENV === 'development' ? testChains : prodChains)],
	[publicProvider()]
)

const connectors = [
	new MetaMaskConnector({ chains }),
	new WalletConnectLegacyConnector({
		chains,
		options: {
			qrcode: true,
		},
	}),
	new CoinbaseWalletConnector({
		chains,
		options: {
			appName: 'Crypto Donutz',
		},
	}),
]

interface IBlockchainInfo {
	icon: string
	color: string
	exchangeName: ExchangeNames
	contractAddress: `0x${string}`
}

export const chainNetworks = chains.map(({ network }) => network)

export const chainNames = chains.map(({ name }) => name)

export type BlockchainNetworks = (typeof chainNetworks)[number]

export type BlockchainNames = (typeof chainNames)[number]

export type BlockchainsInfo = Record<BlockchainNetworks, IBlockchainInfo>

export const blockchainsInfo: BlockchainsInfo = {
	'evmos-testnet': {
		// testnet
		icon: evmosIcon,
		color: '#009393',
		exchangeName: ExchangeNames.EVMOS,
		contractAddress: '0xeb9bab732b7C24428CC21DDB5Aed8F43209bDB37',
	},
	'arbitrum-goerli': {
		// testnet
		icon: ethIcon,
		color: 'rgba(242, 244, 247, 0.8)',
		exchangeName: ExchangeNames.ETH,
		contractAddress: '0xE15B011f681632AFcC7F4a732D4b356da0fAC86A',
	},
	homestead: {
		icon: ethIcon,
		color: 'rgba(242, 244, 247, 0.8)',
		exchangeName: ExchangeNames.ETH,
		contractAddress: '0x2d6036bCd363bf720442455dd2FB942b70Ca6717',
	},
	'bsc-testnet': {
		// testnet
		icon: bnbIcon,
		color: 'rgba(240, 185, 11, 0.8)',
		exchangeName: ExchangeNames.BNB,
		contractAddress: '0x2d6036bCd363bf720442455dd2FB942b70Ca6717',
	},
	bsc: {
		icon: bnbIcon,
		color: 'rgba(240, 185, 11, 0.8)',
		exchangeName: ExchangeNames.EVMOS,
		contractAddress: '0x2d6036bCd363bf720442455dd2FB942b70Ca6717',
	},
	'avalanche-fuji': {
		// testnet
		icon: avaxIcon,
		color: 'rgba(232, 65, 66, 0.8)',
		exchangeName: ExchangeNames.AVAX,
		contractAddress: '0x353Cc5cF5d1bB7319E814A17c718601ce8D59de8',
	},
	avalanche: {
		icon: avaxIcon,
		color: 'rgba(232, 65, 66, 0.8)',
		exchangeName: ExchangeNames.AVAX,
		contractAddress: '0x2d6036bCd363bf720442455dd2FB942b70Ca6717',
	},
	maticmum: {
		// testnet
		icon: maticIcon,
		color: 'rgba(130, 71, 229, 0.8)',
		exchangeName: ExchangeNames.MATIC,
		contractAddress: '0xd589fB2a40362a7c6cfda2dA36c2cE06e4B13d63',
	},
	matic: {
		icon: maticIcon,
		color: 'rgba(130, 71, 229, 0.8)',
		exchangeName: ExchangeNames.MATIC,
		contractAddress: '0x8c408C8df8A61Da4DA487c3d1a3e7F4a169837A6',
	},
}

export type FullBlockchainInfo = Chain & IBlockchainInfo

export type FullBlockchainsInfo = Record<BlockchainNetworks, Chain & IBlockchainInfo>

export const fullChainsInfo = chainNetworks.reduce((acc, name) => {
	const chain = chains.find((c) => c.network === name)
	return {
		...acc,
		[name]: {
			...chain,
			...blockchainsInfo[name],
		},
	}
}, {} as FullBlockchainsInfo)

const connectorNames = connectors.map((connector) => connector.id)

export type walletNames = (typeof connectorNames)[number]

export const walletsInfo: Record<walletNames, { image: string; name: string }> = {
	metaMask: { image: metamaskIcon, name: 'Metamask' },
	walletConnectLegacy: { image: walletConnectIcon, name: 'WalletConnect' },
	coinbaseWallet: { image: coinbaseWalletIcon, name: 'Coinbase Wallet' },
}

export const client = createClient({
	autoConnect: true,
	connectors,
	provider,
	webSocketProvider,
})
