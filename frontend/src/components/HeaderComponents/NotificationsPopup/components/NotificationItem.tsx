import { useMemo } from "react";
import { Badge } from "antd";
import { useDispatch } from "react-redux";
import { CloseOutlined } from "@ant-design/icons";
import { InView } from "react-intersection-observer";
import dayjsModule from "modules/dayjsModule";
import { INotification } from "types";

import axiosClient from "modules/axiosClient";
import {
  getBadgeNotificationMessage,
  getDonatNotificationMessage,
} from "utils";
import { setNotifications } from "store/types/Notifications";
import { typeNotification } from "utils/notifications/types";
import { useAppSelector } from "hooks/reduxHooks";

const NotificationItem = ({
  notification,
  handlerNotificationPopup,
}: {
  notification: INotification;
  handlerNotificationPopup: () => void;
}) => {
  const dispatch = useDispatch();
  const { notifications, user } = useAppSelector((state) => state);

  const { list } = notifications;
  const { id: userID } = user;
  const { id, read, donation, badge, sender, recipient, created_at } =
    notification;

  const messageClick = () => handlerNotificationPopup();

  const handleChange = async (status: boolean) => {
    if (!status) return;
    if (status && !read) {
      const { data, status: codeStatus } = await axiosClient.put(
        "/api/notification/status",
        {
          id,
          read: status,
          userID,
        }
      );
      if (codeStatus === 200 && data) {
        const updatedList = list.map((n) => {
          if (n.id === id) {
            return {
              ...n,
              read: data.read,
            };
          }
          return n;
        });
        dispatch(
          setNotifications({
            list: updatedList,
            shouldUpdateApp: false,
          })
        );
      }
    }
  };

  const deleteItem = async () => {
    const { data, status } = await axiosClient.delete(
      `/api/notification/${id}/${userID}`
    );
    if (status === 200 && data) {
      const updatedList = list.filter((n) => n.id !== id);
      dispatch(
        setNotifications({
          list: updatedList,
          shouldUpdateApp: false,
        })
      );
    }
  };

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

export { NotificationItem };
