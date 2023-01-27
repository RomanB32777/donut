import { Badge } from "antd";
import { InView } from "react-intersection-observer";
import dayjsModule from "modules/dayjsModule";
import { INotification } from "types";

import axiosClient from "modules/axiosClient";
import { getNotificationMessage } from "utils";
import { typeNotification } from "utils/notifications/types";
import { useMemo } from "react";

interface INotificationStatus {
  id: number;
  read: boolean;
}

const NotificationItem = ({
  notification,
  userID,
}: {
  notification: INotification;
  userID: number;
}) => {
  const { id, read, donation, badge, sender, recipient, created_at } =
    notification;

  console.log(notification);

  const updateNotification = async ({ id, read }: INotificationStatus) => {
    const { data, status } = await axiosClient.put(`/api/notification/status`, {
      id,
      read,
    });
    if (status === 200) return data.updatedNotification;
  };

  const handleChange =
    ({ id, read }: INotificationStatus) =>
    async (status: boolean) => {
      if (!status) return;
      if (status && !read) {
        const updatedNotification = await updateNotification({
          id,
          read: status,
        });
        // if (updatedNotification) {
        //   setNotifications((prev) =>
        //     prev.map((n: any) => {
        //       const readField = getNotificationUserRole(n.recipient);
        //       if (n.id === id) {
        //         return {
        //           ...n,
        //           [readField]: updatedNotification[readField],
        //         };
        //       }
        //       return n;
        //     })
        //   );
        // }
      }
    };

  const notificationType = useMemo((): typeNotification => {
    const { donation, badge, sender, recipient } = notification;
    if (donation) {
      if (sender) return "donat_creator";
      else if (recipient) return "donat_supporter";
    }

    if (badge) {
      if (sender) return "add_badge_creator";
      else if (recipient) return "add_badge_supporter";
    }

    return "none";
  }, [notification]);

  // const isNotificationBadgeStatus = n.badge && n.recipient === n.sender;
  // const badgeType =
  //   n.badge &&
  //   (isNotificationBadgeStatus
  //     ? n.badge.transaction_status !== "pending" &&
  //       `${n.badge.transaction_status}_badge`
  //     : n.badge.creator_id === userID
  //     ? "add_badge_creator"
  //     : "add_badge_supporter");

  // const badgeData =
  //   n.badge &&
  //   n.badge.transaction_status !== "pending" &&
  //   (n.badge.transaction_status === "success"
  //     ? n.badge.id
  //     : n.badge.transaction_hash);

  return (
    <InView
      onChange={handleChange({
        id,
        read,
      })}
      key={id}
    >
      {({ ref }) => (
        <div className="item" ref={ref}>
          <Badge dot={!read} className="dot">
            {donation &&
              getNotificationMessage({
                type: notificationType,
                user: sender || recipient || "",
                data: {
                  sum_donation: donation.sum_donation,
                  blockchain: donation.blockchain,
                  donation_message: donation.donation_message,
                },
              })}

            {badge &&
              getNotificationMessage({
                type: notificationType,
                user: sender || recipient || "",
              })}
            <p className="date">
              {dayjsModule(created_at).startOf("minutes").fromNow()}
            </p>
          </Badge>
        </div>
      )}
    </InView>
  );
};

export { NotificationItem };
