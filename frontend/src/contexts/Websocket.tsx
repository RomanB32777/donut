import { createContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { IBadgeBase, ISocketNotification } from "types";

import { useAppSelector } from "hooks/reduxHooks";
import { useLazyGetNotificationsQuery } from "store/services/NotificationsService";
import {
  addNotification,
  getBadgeNotificationMessage,
  getDonatNotificationMessage,
} from "utils";
import { baseURL, isProduction, socketsBaseUrl } from "consts";

const WebSocketContext = createContext<Socket | null>(null);

const useSocketConnection = (username: string) => {
  const [getNotifications] = useLazyGetNotificationsQuery();

  const connectSocket = () => {
    const socket = io(isProduction ? baseURL : socketsBaseUrl, {
      path: "/sockt/",
      query: {
        userName: username,
      },
    });

    socket.on("connect", () => {
      console.log("connect");
    });

    socket.on("connect_error", () => {
      console.log("connect_error");
    });

    socket.on("disconnect", () => {
      console.log("disconnect");
    });

    socket.on("new_donat_notification", (data: ISocketNotification) => {
      addNotification({
        type: "info",
        title: "New donut",
        message: getDonatNotificationMessage({
          type: "donat_creator",
          user: data.supporter,
          data: data.additional,
        }),
      });
      getNotifications({ user: username });
    });

    socket.on(
      "new_badge_notification",
      (data: ISocketNotification<IBadgeBase>) => {
        addNotification({
          type: "info",
          title: "New badge",
          message: getBadgeNotificationMessage({
            type: "add_badge_supporter",
            user: data.supporter,
            data: data.additional,
          }),
        });
        getNotifications({ user: username });
      }
    );

    return socket;
  };

  return { connectSocket };
};

const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const { username } = useAppSelector(({ user }) => user);
  const [socketContext, setSocketContext] = useState<null | Socket>(null);
  const { connectSocket } = useSocketConnection(username);

  useEffect(() => {
    if (username) {
      const socket = connectSocket();
      setSocketContext(socket);

      return () => {
        socket.disconnect();
      };
    }
  }, [username]);

  return (
    <WebSocketContext.Provider value={socketContext}>
      {children}
    </WebSocketContext.Provider>
  );
};

export { WebSocketContext, useSocketConnection, WebSocketProvider };
