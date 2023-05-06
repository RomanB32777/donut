import { IBadgeInfo } from 'types'
import { BlockchainNames } from 'utils/wallets/wagmi'
import { IFileInfo } from './files'

export type IBadge = IBadgeInfo<IFileInfo, string, BlockchainNames>

export type IBadgePage = IBadgeInfo<string, string, BlockchainNames>
