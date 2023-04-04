import {
  NotificationTitleMessage,
  NOTIFICATION_TYPE,
} from "react-notifications-component";
import { IDonationShortInfo } from "types";

export interface INotification {
  type: NOTIFICATION_TYPE;
  title: NotificationTitleMessage;
  message?: NotificationTitleMessage;
  id?: string;
}

export interface INotificationWithoutType
  extends Partial<Omit<INotification, "type">> {
  message: NotificationTitleMessage;
}

export type typeNotification =
  | "donat_creator"
  | "donat_supporter"
  | "add_badge_creator"
  | "add_badge_supporter"
  | "none";

export interface INotificationMessage<T = IDonationShortInfo> {
  type: typeNotification;
  user: string;
  data: T;
}
