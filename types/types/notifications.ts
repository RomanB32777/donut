import { IBadgeInfo } from "./badge";
import { IDonation } from "./donations";

type notificationRoles = "sender" | "recipient";

interface INotification {
  id: number;
  created_at: string;
  sender?: string; // sender username
  recipient?: string; // recipient username
  roleplay: notificationRoles;
  read: boolean;
  donation?: IDonation;
  badge?: IBadgeInfo;
  // user_id: number;
}

// const t = {
//   donation: {
//     username: "@sdgsdg32",
//     is_anonymous: false,
//   },
// };

type notificationKeys = keyof INotification;

interface INotificationQueries {
  limit?: number;
  offset?: number;
  sort?: notificationKeys; // sort field
  sortDirection?: string;
  spam_filter?: boolean;
  roleplay?: notificationRoles;
}

export type {
  notificationRoles,
  notificationKeys,
  INotification,
  INotificationQueries,
};
