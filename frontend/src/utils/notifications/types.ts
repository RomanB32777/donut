import {
  NotificationTitleMessage,
  NOTIFICATION_TYPE,
} from "react-notifications-component";

export interface INotification {
  type: NOTIFICATION_TYPE;
  title: string;
  message?: NotificationTitleMessage;
}

declare type typeNotification =
  | "donat_creator"
  | "donat_supporter"
  | "add_badge_creator"
  | "add_badge_supporter"
  | "remove_badge_creator"
  | "remove_badge_supporter";

export type { typeNotification };
