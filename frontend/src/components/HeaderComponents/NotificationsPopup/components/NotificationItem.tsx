import { memo, useMemo } from "react";
import { Badge } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { InView } from "react-intersection-observer";
import dayjsModule from "modules/dayjsModule";
import { INotification } from "types";

import { useAppSelector } from "hooks/reduxHooks";
import {
  useDeleteNotificationMutation,
  useSetStatusNotificationMutation,
} from "store/services/NotificationsService";
import {
  getBadgeNotificationMessage,
  getDonatNotificationMessage,
} from "utils";
import { typeNotification } from "utils/notifications/types";

const NotificationItem = ({
  notification,
  handlerNotificationPopup,
}: {
  notification: INotification;
  handlerNotificationPopup: () => void;
}) => {
  const { id: userID } = useAppSelector(({ user }) => user);

  const [setStatusNotification] = useSetStatusNotificationMutation();

  const [deleteNotification] = useDeleteNotificationMutation();

  const { id, read, donation, badge, sender, recipient, created_at } =
    notification;

  const messageClick = () => handlerNotificationPopup();

  const handleChange = async (status: boolean) => {
    if (!status) return;
    if (status && !read) {
      await setStatusNotification({
        id,
        read: status,
        userID,
      });
    }
  };

  const deleteItem = async () => await deleteNotification({ id, userID });

  const notificationType = useMemo((): typeNotification => {
    const { donation, badge, sender, recipient } = notification;
    if (donation) {
      if (sender) return "donat_creator";
      else if (recipient) return "donat_supporter";
    }

    if (badge) {
      if (sender)
        return "add_badge_supporter"; // render for supporter (sender = creator)
      else if (recipient) return "add_badge_creator"; // render for creator (recipient = supporter)
    }

    return "none";
  }, [notification]);

  return (
    <InView onChange={handleChange} key={id}>
      {({ ref }) => (
        <div className="item" ref={ref}>
          <Badge dot={!read} className="dot">
            <div className="content">
              <div className="message" onClick={messageClick}>
                {donation &&
                  getDonatNotificationMessage({
                    type: notificationType,
                    user: sender || recipient || "",
                    data: {
                      sum_donation: donation.sum_donation,
                      blockchain: donation.blockchain,
                      donation_message: donation.donation_message,
                    },
                  })}

                {badge &&
                  getBadgeNotificationMessage({
                    type: notificationType,
                    user: sender || recipient || "",
                    data: {
                      id: badge.id,
                      title: badge.title,
                    },
                  })}
              </div>
              <CloseOutlined onClick={deleteItem} />
            </div>
            <p className="date">
              {dayjsModule(created_at).startOf("minutes").fromNow()}
            </p>
          </Badge>
        </div>
      )}
    </InView>
  );
};

export default memo(NotificationItem);
