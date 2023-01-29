import { createContext, useEffect, useState, ReactNode } from "react";
import { useDispatch } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { io, Socket } from "socket.io-client";
import { IBadgeBase, ISocketNotification } from "types";

import { useAppSelector } from "hooks/reduxHooks";
import { getNotifications } from "store/types/Notifications";
import {
  addNotification,
  getBadgeNotificationMessage,
  getDonatNotificationMessage,
} from "utils";
import { baseURL, isProduction, socketsBaseUrl } from "consts";

const WebSocketContext = createContext<Socket | null>(null);

export { WebSocketContext };

export const connectSocket = (
  username: string,
  dispatch: Dispatch<AnyAction>
) => {
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
    dispatch(getNotifications({ user: username }));
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
      dispatch(getNotifications({ user: username }));
    }
  );
  return socket;
};

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [valueContext, setValueContext] = useState<null | Socket>(null);
  const { username } = useAppSelector(({ user }) => user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (username) {
      const socket = connectSocket(username, dispatch);
      setValueContext(socket);

      return () => {
        socket.disconnect();
      };
    }
  }, [username]);

  return (
    <WebSocketContext.Provider value={valueContext}>
      {children}
    </WebSocketContext.Provider>
  );
};
