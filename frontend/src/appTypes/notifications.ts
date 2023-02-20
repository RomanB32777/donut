import { INotification, INotificationQueries } from "types";

interface INotificationsState {
  list: INotification[];
  shouldUpdateApp: boolean;
}

interface INotificationParams extends INotificationQueries {
  user: number | string;
  shouldUpdateApp?: boolean;
}

interface IVisibleNotification {
  isVisibleNotification?: boolean;
}

export type { INotificationsState, INotificationParams, IVisibleNotification };
