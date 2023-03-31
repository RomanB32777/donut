import { createContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { IBadgeBase, ISocketNotification } from "types";
import { useIntl } from "react-intl";

import { useAppSelector } from "hooks/reduxHooks";
import { useLazyGetNotificationsQuery } from "store/services/NotificationsService";
import {
  addNotification,
  getBadgeNotificationMessage,
  getDonatNotificationMessage,
} from "utils";
import { baseURL } from "consts";

const WebSocketContext = createContext<Socket | null>(null);

const useSocketConnection = (username: string) => {
  const intl = useIntl();
  const [getNotifications] = useLazyGetNotificationsQuery();

  const connectSocket = () => {
    const socket = io(baseURL, {
      path: "/sockt/",
      query: {
        username,
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

    socket.on("newDonat", (data: ISocketNotification) => {
      addNotification({
        type: "info",
        title: intl.formatMessage({ id: "notifications_donat_title" }),
        message: getDonatNotificationMessage(
          {
            type: "donat_creator",
            user: data.supporter,
            data: data.additional,
          },
          intl
        ),
      });
      getNotifications({ username });
    });

    socket.on("newBadge", (data: ISocketNotification<IBadgeBase>) => {
      addNotification({
        type: "info",
        title: intl.formatMessage({ id: "notifications_badge_title" }),
        message: getBadgeNotificationMessage(
          {
            type: "add_badge_supporter",
            user: data.supporter,
            data: data.additional,
          },
          intl
        ),
      });
      getNotifications({ username });
    });

    return socket;
  };

  return { connectSocket };
};

const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const user = useAppSelector(({ user }) => user);
  const [socketContext, setSocketContext] = useState<null | Socket>(null);
  const { connectSocket } = useSocketConnection(user?.username);

  useEffect(() => {
    if (user?.username) {
      const socket = connectSocket();
      setSocketContext(socket);

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  return (
    <WebSocketContext.Provider value={socketContext}>
      {children}
    </WebSocketContext.Provider>
  );
};

export { WebSocketContext, useSocketConnection, WebSocketProvider };
