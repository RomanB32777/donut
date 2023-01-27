import { Badge } from "antd";
import { InView } from "react-intersection-observer";
import dayjsModule from "modules/dayjsModule";
import { INotification } from "types";

import axiosClient from "modules/axiosClient";
import { getNotificationMessage } from "utils";

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

  const checkIsRecipient = (recipient: number) => recipient === userID;

  const getNotificationUserRole = (recipient: number) =>
    checkIsRecipient(recipient) ? "read_recipient" : "read_sender";

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
    <div>tt</div>
    // <InView
    //   onChange={handleChange({
    //     id: n.id,
    //     read: n[getNotificationUserRole(n.recipient)],
    //   })}
    //   key={n.id}
    // >
    //   {({ ref }) => (
    //     <div className="item" ref={ref}>
    //       <Badge dot={!n[getNotificationUserRole(n.recipient)]} className="dot">
    //         {n.donation &&
    //           getNotificationMessage({
    //             type:
    //               n.donation.creator_id === userID
    //                 ? "donat_creator"
    //                 : "donat_supporter",
    //             user: n.donation.username,
    //             data: {
    //               sum_donation: n.donation.sum_donation,
    //               blockchain: n.donation.blockchain,
    //               donation_message: "",
    //             },
    //           })}
    //         {/* {n.badge &&
    //           getNotificationMessage({
    //             type: badgeType,
    //             user:
    //               n.badge.creator_id === userID
    //                 ? n.badge.supporter_username
    //                 : n.badge.creator_username,
    //             // n.badge.badge_name
    //             data: badgeData,
    //           })} */}
    //         <p className="date">
    //           {dayjsModule(n.created_at).startOf("minutes").fromNow()}
    //         </p>
    //       </Badge>
    //     </div>
    //   )}
    // </InView>
  );
};

export { NotificationItem };
