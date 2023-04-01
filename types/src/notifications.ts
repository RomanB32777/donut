import { IBadgeInfo } from "./badge";
import { IDonation } from "./donations";
import { IUserBase } from "./user";

enum NotificationRoles {
  sender = "sender",
  recipient = "recipient",
}

type notificationRoles = keyof typeof NotificationRoles;

interface IUserINotification {
  roleplay: notificationRoles;
  read: boolean;
  visible: boolean;
  user: {
    username: string;
  };
}

interface INotification {
  id: string;
  createdAt: string;
  // TODO - IDonation
  donation?: IDonation;
  badge?: IBadgeInfo;
  users: IUserINotification[];
}

interface ISocketEmitObj {
  toSendUsername: string;
  id: string;
}

type notificationKeys = keyof INotification;

interface INotificationQueries {
  limit?: number;
  offset?: number;
  sort?: notificationKeys; // sort field
  sortDirection?: string;
  spamFilter?: boolean;
  roleplay?: notificationRoles;
}

export { NotificationRoles };

export type {
  notificationRoles,
  ISocketEmitObj,
  notificationKeys,
  INotification,
  INotificationQueries,
};
