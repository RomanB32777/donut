import React, { createContext, useEffect, useState, ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io, Socket } from "socket.io-client";
import { baseURL } from "../../axiosClient";
import { getNotifications } from "../../store/types/Notifications";
import { addNotification, getNotificationMessage } from "../../utils";

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
            addNotification({
              type: "info",
              title: "New donut",
              message: getNotificationMessage(
                "donat_creator",
                data.supporter,
                data.sum
              ),
            });
            break;

          case "following":
            addNotification({
              type: "info",
              title: "New following",
              message: getNotificationMessage(
                "following_creator",
                data.follower
              ),
            });
            break;

          case "add_badge":
            addNotification({
              type: "info",
              title: "New badge",
              message: getNotificationMessage(
                "add_badge_supporter",
                data.supporter,
                data.badgeName
              ),
            });
            break;

          case "remove_badge":
            addNotification({
              type: "info",
              title: "Remove badge",
              message: getNotificationMessage(
                "remove_badge_supporter",
                data.supporter
              ),
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
