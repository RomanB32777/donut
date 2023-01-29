import { IUserBase } from "./user";
import { blockchainsType } from "./wallet";

type badgeStatus = "success" | "failed" | "pending";

interface IBadgeBase {
  id: number;
  title: string;
}

interface IBadgeInfo<ImageType = string> extends IBadgeBase {
  description: string;
  image: ImageType;
  blockchain: blockchainsType;
  creator_id: number;
  token_id?: number;
  assigned?: number;
  is_creator?: boolean;
}

interface IQueryPriceParams {
  address: string;
  token_id: string;
}

export type {
  badgeStatus,
  IBadgeBase,
  IBadgeInfo,
  IQueryPriceParams,
};
