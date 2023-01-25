import { IUserBase } from "./user";
import { blockchainsType } from "./wallet";

type badgeStatus = "success" | "failed" | "pending";

interface IBadgeInfo<ImageType = string> {
  id: number;
  title: string;
  description: string;
  image: ImageType;
  blockchain: blockchainsType;
  creator_id: number;
  token_id?: number;
  assigned?: number;
  is_creator?: boolean;
}

interface IMintBadgeSocketObj {
  supporter: IUserBase;
  creator: IUserBase;
  badge: {
    id?: number;
    name: string;
  };
}

interface IQueryPriceParams {
  address: string;
  token_id: string;
}

export type {
  badgeStatus,
  IBadgeInfo,
  IMintBadgeSocketObj,
  IQueryPriceParams,
};
