import { IUserBase } from "./user";

type badgeStatus = "success" | "failed" | "pending";

interface IBadgeBase {
  id: string;
  title: string;
}

interface IBadgeCreatingInfo<CreatorType = string, blockchainType = string> {
  title: string;
  description: string;
  blockchain: blockchainType;
  creator: CreatorType;
}

interface IBadgeInfo<
  ImageType = string,
  CreatorType = string,
  blockchainType = string
> extends IBadgeBase,
    IBadgeCreatingInfo<CreatorType, blockchainType> {
  image: ImageType;
  tokenId?: number;
  assigned?: number;
  isCreator?: boolean;
}

interface IBagdeAssignInfo {
  userAddress: string;
  tokenId?: number;
}

export type {
  badgeStatus,
  IBadgeBase,
  IBadgeCreatingInfo,
  IBadgeInfo,
  IBagdeAssignInfo,
};
