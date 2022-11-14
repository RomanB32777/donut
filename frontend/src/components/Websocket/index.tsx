import { createContext, useEffect, useState, ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { io, Socket } from "socket.io-client";
import { baseURL } from "../../axiosClient";
import { getNotifications } from "../../store/types/Notifications";
import { addNotification, getNotificationMessage } from "../../utils";

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

  socket.on("new_notification", (data) => {
    const { type } = data;
    switch (type) {
      case "donat":
        let messageDonat = getNotificationMessage({
          type: "donat_creator",
          user: data.supporter,
          data: data.additional,
        });
        addNotification({
          type: "info",
          title: "New donut",
          message: messageDonat,
        });
        break;

      case "add_badge":
        let messageAddBadge = getNotificationMessage({
          type: "add_badge_supporter",
          user: data.supporter,
          data: data.badgeName,
        });
        addNotification({
          type: "info",
          title: "New badge",
          message: messageAddBadge,
        });
        break;

      case "remove_badge":
        let messageRemoveBadge = getNotificationMessage({
          type: "remove_badge_supporter",
          user: data.supporter,
        });
        addNotification({
          type: "info",
          title: "Remove badge",
          message: messageRemoveBadge,
        });
        break;

      case "failed_badge":
        let messageFailedBadge = getNotificationMessage({
          type: "failed_badge",
          data: data.badge.transaction_hash,
        });
        addNotification({
          type: "danger",
          title: "Failed badge",
          message: messageFailedBadge,
        });
        break;

      case "success_badge":
        let messageSuccessedBadge = getNotificationMessage({
          type: "success_badge",
          data: data.badge.id,
        });
        addNotification({
          type: "success",
          title: "Successed badge",
          message: messageSuccessedBadge,
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
