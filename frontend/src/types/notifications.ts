import { INotification } from "types";

interface INotificationsState {
  list: INotification[];
  shouldUpdateApp: boolean;
}

interface INotificationsAction {
  type: string;
  payload: INotificationsState;
}

export type { INotificationsState, INotificationsAction };
