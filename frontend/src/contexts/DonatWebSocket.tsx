import { createContext, useEffect, useState, ReactNode } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { io, Socket } from "socket.io-client";

import { useAppSelector } from "hooks/reduxHooks";
import { getNotifications } from "store/types/Notifications";
import { baseURL, isProduction, socketsBaseUrl } from "consts";

export const DonatWebSocketContext = createContext<Socket | null>(null);

const DonatWebSocketProvider = ({ children }: { children: ReactNode }) => {
  const { name } = useParams();
  const dispatch = useDispatch();
  const { id, spam_filter } = useAppSelector(({ personInfo }) => personInfo);
  const [valueContext, setValueContext] = useState<null | Socket>(null);

  const setUnloginUserSocket = ({
    username,
    spam_filter,
  }: {
    username: string;
    spam_filter: boolean;
  }) => {
    const socket = io(isProduction ? baseURL : socketsBaseUrl, {
      path: "/sockt/",
      query: {
        userName: username,
      },
    });

    socket.on("new_donat_notification", () => {
      dispatch(
        getNotifications({
          user: username,
          limit: 1,
          spam_filter,
          roleplay: "recipient",
        })
      );
    });
    return socket;
  };

  useEffect(() => {
    if (name) {
      const socketUnlogin = setUnloginUserSocket({
        username: name,
        spam_filter,
      });
      setValueContext(socketUnlogin);
      return () => {
        socketUnlogin.disconnect();
      };
    }
  }, [id, name, spam_filter]);

  return (
    <DonatWebSocketContext.Provider value={valueContext}>
      {children}
    </DonatWebSocketContext.Provider>
  );
};

export default DonatWebSocketProvider;
