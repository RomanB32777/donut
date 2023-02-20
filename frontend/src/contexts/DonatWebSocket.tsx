import { createContext, useEffect, useState, ReactNode } from "react";
import { useParams } from "react-router";
import { io, Socket } from "socket.io-client";

import { useLazyGetNotificationsQuery } from "store/services/NotificationsService";
import { useGetCreatorInfoQuery } from "store/services/UserService";
import { addNotFoundUserNotification } from "utils";
import { baseURL, isProduction, socketsBaseUrl } from "consts";

export const DonatWebSocketContext = createContext<Socket | null>(null);

const DonatWebSocketProvider = ({ children }: { children: ReactNode }) => {
  const { name } = useParams();
  const [getNotifications] = useLazyGetNotificationsQuery({
    refetchOnFocus: false,
  });

  const { data: personInfo, isError } = useGetCreatorInfoQuery(name as string, {
    skip: !name,
  });

  const [valueContext, setValueContext] = useState<null | Socket>(null);

  useEffect(() => {
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

      socket.on("new_donat_notification", async () => {
        getNotifications({
          user: username,
          limit: 1,
          spam_filter,
          roleplay: "recipient",
        });
      });
      return socket;
    };

    if (name && personInfo) {
      const socketUnlogin = setUnloginUserSocket({
        username: name,
        spam_filter: personInfo.spam_filter,
      });
      setValueContext(socketUnlogin);
      return () => {
        socketUnlogin.disconnect();
      };
    }
  }, [name, personInfo]);

  if (isError) addNotFoundUserNotification();

  return (
    <DonatWebSocketContext.Provider value={valueContext}>
      {children}
    </DonatWebSocketContext.Provider>
  );
};

export default DonatWebSocketProvider;
