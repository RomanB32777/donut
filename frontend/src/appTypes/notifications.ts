import { INotification, INotificationQueries } from "types";

interface INotificationsState {
  list: INotification[];
  shouldUpdateApp: boolean;
}

interface INotificationsAction {
  type: string;
  payload: INotificationsState;
}

interface INotificationParams extends INotificationQueries {
  user: number | string;
  shouldUpdateApp?: boolean;
}

export type { INotificationsState, INotificationsAction, INotificationParams };
