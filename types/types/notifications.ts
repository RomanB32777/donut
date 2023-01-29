import { IBadgeInfo } from "./badge";
import { IDonation } from "./donations";
import { IUserBase } from "./user";

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
}

interface ISocketEmitObj {
  supporter: IUserBase;
  creator: IUserBase;
  id: number;
}

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
  ISocketEmitObj,
  notificationKeys,
  INotification,
  INotificationQueries,
};
