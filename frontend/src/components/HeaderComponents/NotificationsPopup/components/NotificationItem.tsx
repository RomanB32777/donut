import { memo, useMemo } from "react";
import { Badge } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { InView } from "react-intersection-observer";
import dayjsModule from "modules/dayjsModule";
import { INotification } from "types";

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
  username,
  notification,
  handlerNotificationPopup,
}: {
  username: string;
  notification: INotification;
  handlerNotificationPopup: () => void;
}) => {
  const [setStatusNotification] = useSetStatusNotificationMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const { id, users, donation, badge, createdAt } = notification;

  const userNotification = users.find(({ user }) => user.username === username);

  const messageClick = () => handlerNotificationPopup();

  const handleChange = async (status: boolean) => {
    if (userNotification) {
      const { read } = userNotification;
      if (!status) return;
      if (status && !read) {
        await setStatusNotification(id);
      }
    }
  };

  const deleteItem = async () => await deleteNotification(id);

  const notificationType = useMemo((): typeNotification => {
    if (userNotification) {
      const { roleplay } = userNotification;
      const { donation, badge } = notification;
      const isRecipient = roleplay === "recipient";
      if (donation) {
        if (isRecipient) return "donat_creator";
        else return "donat_supporter";
      }

      if (badge) {
        if (isRecipient) {
          return "add_badge_supporter";
        } else return "add_badge_creator";
      }
    }

    return "none";
  }, [notification, userNotification]);

  if (!userNotification) return null;

  const { read, user } = userNotification;

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
                    user: user.username,
                    data: {
                      sum: donation.sum,
                      blockchain: donation.blockchain,
                      message: donation.message,
                    },
                  })}

                {badge &&
                  getBadgeNotificationMessage({
                    type: notificationType,
                    user: user.username,
                    data: {
                      id: badge.id,
                      title: badge.title,
                    },
                  })}
              </div>
              <CloseOutlined onClick={deleteItem} />
            </div>
            <p className="date">
              {dayjsModule(createdAt).startOf("minutes").fromNow()}
            </p>
          </Badge>
        </div>
      )}
    </InView>
  );
};

export default memo(NotificationItem);
