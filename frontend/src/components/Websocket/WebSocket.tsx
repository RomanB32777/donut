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
import { useLocation } from "react-router";

const WebSocketContext = createContext<Socket | null>(null);

export { WebSocketContext };

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [valueContext, setValueContext] = useState<null | Socket>(null);
  const user = useSelector((state: any) => state.user);
  const { pathname } = useLocation();

  const dispatch = useDispatch();

  const setUnloginUserSocket = (username: string) => {
    const socket = io(baseURL, {
      path: "/sockt/",
      query: {
        userName: username,
      },
    });

    socket.on("new_notification", (data) => {
      const { type } = data;
      switch (type) {
        case "donat":
          dispatch(getNotifications(username));
          break;
      }
    });
    return socket;
  };

  useEffect(() => {
    if (!(user && user.user_id && user.username)) {
      const pathnameEnd = pathname.slice(pathname.indexOf("@"));
      const socketUnlogin = setUnloginUserSocket(pathnameEnd.slice(0, pathnameEnd.indexOf("/")))
      setValueContext(socketUnlogin);

      return () => {
        socketUnlogin.disconnect();
      };
    } else if (user && user.user_id && user.username) {
      const socket = io(baseURL, {
        path: "/sockt/",
        query: {
          userName: user.username,
        },
      });

      socket.on("new_notification", (data) => {
        const { type } = data;
        switch (type) {
          case "donat":
            let messageDonat = getNotificationMessage(
              "donat_creator",
              data.supporter,
              data.additional
            );
            addNotification({
              type: "info",
              title: "New donut",
              message: messageDonat,
            });
            if (checkNotifPermissions())
              new Notification(
                `Supporter: ${data.supporter}; Sum: ${data.additional.sum} ${
                  data.additional.wallet === "tron" ? "TRX" : "MATIC"
                }; Message: ${data.additional.message}`,
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
