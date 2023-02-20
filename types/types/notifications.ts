import { IBadgeInfo } from "./badge";
import { IDonation } from "./donations";
import { IUserBase } from "./user";

type notificationRoles = "sender" | "recipient";

interface INotificationBase {
  id: number;
  read: boolean;
}

interface INotification extends INotificationBase {
  created_at: string;
  sender?: string; // sender username
  recipient?: string; // recipient username
  roleplay: notificationRoles;
  donation?: IDonation;
  badge?: IBadgeInfo;
}

interface INotificationChangeStatus extends INotificationBase {
  userID: number;
}

interface INotificationDelete {
  id: number;
  userID: number;
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
  INotificationBase,
  INotificationChangeStatus,
  INotificationDelete,
  INotification,
  INotificationQueries,
};
