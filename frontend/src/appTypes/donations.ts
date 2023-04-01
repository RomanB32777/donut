import { IDonation, IUserBase } from "types";

export interface IDonationWidgetInfo
  extends Omit<IDonation, "createdAt" | "backer" | "creator"> {
  // TODO - createdAt format all string or date ???
  createdAt: string;
  creator: Omit<IUserBase, "id">;
  backer: Omit<IUserBase, "id">;
  blockchainSum?: number;
  username?: string;
}
