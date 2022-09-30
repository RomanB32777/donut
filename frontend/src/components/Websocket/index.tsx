import { createContext, useEffect, useState, ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AnyAction, Dispatch } from "redux";
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

export const connectSocket = (
  username: string,
  dispatch: Dispatch<AnyAction>
) => {
  const socket = io(baseURL, {
    path: "/sockt/",
    query: {
      userName: username,
    },
  })

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
            `Supporter: ${data.supporter}; Sum: ${
              data.additional.sum
            } ${"tEVMOS"}; Message: ${data.additional.message}`,
            { image: notifImage }
          );
        // data.additional.wallet === "tron" ? "TRX" : "MATIC"
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
    dispatch && dispatch(getNotifications(username));
  });
  return socket;
};

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [valueContext, setValueContext] = useState<null | Socket>(null);
  const user = useSelector((state: any) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user.username) {
      const socket = connectSocket(user.username, dispatch);
      setValueContext(socket);

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  return (
    <WebSocketContext.Provider value={valueContext}>
      {children}
    </WebSocketContext.Provider>
  );
};
