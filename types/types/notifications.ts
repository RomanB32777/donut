import { IBadgeInfo } from "./badge";
import { IDonation } from "./donations";

type notificationRoles = "sender" | "recipient";

interface INotification {
  id: number;
  donation?: IDonation;
  badge?: IBadgeInfo;
  created_at: string;
  user_id: number;
  username: string;
  roleplay: notificationRoles;
  read: boolean;
}

export type { INotification };
