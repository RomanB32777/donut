import { IUserBase } from "./user";
import { blockchainsType } from "./wallet";

interface IDonation {
  id: number;
  blockchain: blockchainsType;
  backer_id: number;
  creator_id: number;
  sum_donation: number;
  donation_date: string;
  donation_message: string;
  goal_id?: string;
}

interface INewDonatSocketObj {
  supporter: IUserBase;
  creator: IUserBase;
  blockchain: string;
  sum: number;
  donation_id: number;
}

interface ISendDonat {
  message: string;
  username: string;
  amount: number;
  selectedBlockchain: string; // blockchainsType
  selectedGoal: number | null;
  isAnonymous: boolean;
}

interface IFullSendDonat extends ISendDonat {
  creator_address: string;
  backer_address: string;
}

export type { IDonation, INewDonatSocketObj, ISendDonat, IFullSendDonat };
