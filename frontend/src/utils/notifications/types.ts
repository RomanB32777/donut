import {
  NotificationTitleMessage,
  NOTIFICATION_TYPE,
} from "react-notifications-component";
import { IDonationShortInfo } from "types";

export interface INotification {
  type: NOTIFICATION_TYPE;
  title: string;
  message?: NotificationTitleMessage;
}

export interface INotificationWithoutType {
  title?: string;
  message: NotificationTitleMessage;
}

declare type typeNotification =
  | "donat_creator"
  | "donat_supporter"
  | "add_badge_creator"
  | "add_badge_supporter"
  | "none";

interface INotificationMessage<T = IDonationShortInfo> {
  type: typeNotification;
  user: string;
  data?: T;
}

interface IGetNotificationMessage {
  <T>(arg: INotificationMessage<T>): void;
}

export type { INotificationMessage, IGetNotificationMessage, typeNotification };
