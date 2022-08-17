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
        path: '/sockt/',
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
        const title = type === "donat" ? "New donut" : "New following";
        const message =
          type === "donat"
            ? getNotificationMessage("donat_creater", data.supporter, data.sum)
            : getNotificationMessage("following_creater", data.follower);
        addNotification({
          type: "info",
          title,
          message,
        });
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
