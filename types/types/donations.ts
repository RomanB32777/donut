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

export type { IDonation, INewDonatSocketObj };
