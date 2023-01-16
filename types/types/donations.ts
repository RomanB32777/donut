import { IUserBase } from "./user";
import { blockchainsSymbols, blockchainsType } from "./wallet";

interface IDonationShortInfo {
  sum_donation: number;
  blockchain: blockchainsType;
  donation_message: string;
}

interface IDonation extends IDonationShortInfo {
  id: number;
  backer_id: number;
  creator_id: number;
  created_at: string;
  goal_id?: string;
}

interface INewDonatSocketObj {
  supporter: IUserBase;
  creator: IUserBase;
  donation_id: number;
}

type socketNotificationTypes = "donat" | "add_badge";

interface ISocketNotification<T = IDonationShortInfo> {
  type: socketNotificationTypes;
  supporter: string;
  additional?: T;
}

interface ISendDonat {
  message: string;
  username: string;
  amount: number;
  selectedBlockchain: blockchainsSymbols;
  selectedGoal: number | null;
  is_anonymous: boolean;
}

interface IFullSendDonat extends ISendDonat {
  creator: number;
  backer: number;
}

export type {
  IDonationShortInfo,
  IDonation,
  INewDonatSocketObj,
  socketNotificationTypes,
  ISocketNotification,
  ISendDonat,
  IFullSendDonat,
};
