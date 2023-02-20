import { IUserBase } from "./user";
import { blockchainsType } from "./wallet";

type badgeStatus = "success" | "failed" | "pending";

interface IBadgeBase {
  id: number;
  title: string;
}

interface IBadgeCreatingInfo {
  title: string;
  description: string;
  blockchain: blockchainsType;
  creator_id: number;
}

interface IBadgeInfo<ImageType = string> extends IBadgeBase, IBadgeCreatingInfo {
  image: ImageType;
  token_id?: number;
  assigned?: number;
  is_creator?: boolean;
}

interface IBagdeAssignInfo {
  badgeID: number;
  supporter_wallet_address: string;
  token_id?: number;
}

interface IQueryPriceParams {
  wallet_address: string;
  token_id?: number;
}

interface IBadgeQueryData {
  id: number;
  wallet_address: string;
}

export type {
  badgeStatus,
  IBadgeBase,
  IBadgeCreatingInfo,
  IBadgeInfo,
  IBagdeAssignInfo,
  IQueryPriceParams,
  IBadgeQueryData,
};
