import { IUserBase } from "./user";

type badgeStatus = "success" | "failed" | "pending";

interface IBadgeShort {
  id?: number;
  contract_address: string;
  creator_id: number;
}

interface IBadgeInfo extends IBadgeShort {
  contributor_user_id_list?: string;
  blockchain: string;
  transaction_hash: string;
  result: badgeStatus | null;
}

interface IBadgeData extends IBadgeInfo {
  title: string;
  description: string;
  quantity: number;
  URI?: string;
}

interface IMintBadgeSocketObj {
  supporter: IUserBase;
  creator: IUserBase;
  badge: {
    id?: number;
    name: string;
  };
}

export type {
  badgeStatus,
  IBadgeShort,
  IBadgeInfo,
  IBadgeData,
  IMintBadgeSocketObj,
};
