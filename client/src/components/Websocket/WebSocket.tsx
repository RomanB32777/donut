import React, { createContext, useEffect, useState, ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io, Socket } from "socket.io-client";
import { baseURL } from "../../axiosClient";
import { getNotifications } from "../../store/types/Notifications";
import {
  addNotification,
  checkNotifPermissions,
  getNotificationMessage,
} from "../../utils";

import notifImage from "../../assets/notif_donation.png";

const WebSocketContext = createContext<Socket | null>(null);

export { WebSocketContext };

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [valueContext, setValueContext] = useState<null | Socket>(null);
  const user = useSelector((state: any) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user.user_id) {
      const socket = io(baseURL, {
        path: "/sockt/",
        query: {
          userId: user.user_id,
        },
      });

      socket.on("connect", () => {
        console.log("connect");
        // user && user.user_id && socket.emit("connect_user", user.user_id);
      });

      socket.on("connect_error", () => {
        console.log("connect_error");
      });

      socket.on("disconnect", () => {
        console.log("disconnect");
      });

      socket.on("new_notification", (data) => {
        const { type } = data;
        switch (type) {
          case "donat":
            let messageDonat = getNotificationMessage(
              "donat_creator",
              data.supporter,
              data.sum
            );
            addNotification({
              type: "info",
              title: "New donut",
              message: messageDonat,
            });
            if (checkNotifPermissions())
              new Notification(
                `Supporter: ${data.supporter};
                Sum: ${data.sum}
                Message: ${messageDonat}
              `,
                { image: notifImage }
              );
            break;

          case "following":
            let messageFollowing = getNotificationMessage(
              "following_creator",
              data.follower
            );
            addNotification({
              type: "info",
              title: "New following",
              message: messageFollowing,
            });
            // if (checkNotifPermissions()) new Notification(messageFollowing, { image: notifImage });
            break;

          case "add_badge":
            let messageAddBadge = getNotificationMessage(
              "add_badge_supporter",
              data.supporter,
              data.badgeName
            );
            addNotification({
              type: "info",
              title: "New badge",
              message: messageAddBadge,
            });
            break;

          case "remove_badge":
            let messageRemoveBadge = getNotificationMessage(
              "remove_badge_supporter",
              data.supporter
            );
            addNotification({
              type: "info",
              title: "Remove badge",
              message: messageRemoveBadge,
            });
            break;

          default:
            break;
        }
        dispatch(getNotifications(user.user_id));
      });

      setValueContext(socket);

      return () => {
        socket.disconnect();
      };
    }
  }, [user.user_id]);

  return (
    <WebSocketContext.Provider value={valueContext}>
      {children}
    </WebSocketContext.Provider>
  );
};
