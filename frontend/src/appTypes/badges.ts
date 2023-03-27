import { IBadgeInfo } from "types";
import { BlockchainNames } from "utils/wallets/wagmi";
import { IFileInfo } from "./files";

export interface IBadge
  extends IBadgeInfo<IFileInfo, string, BlockchainNames> {}

export interface IBadgePage
  extends IBadgeInfo<string, string, BlockchainNames> {}
