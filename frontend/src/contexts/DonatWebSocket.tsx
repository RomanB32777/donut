import { createContext, useEffect, useState, ReactNode } from "react";
import { useParams } from "react-router";
import { io, Socket } from "socket.io-client";

import { useLazyGetNotificationsQuery } from "store/services/NotificationsService";
import { useGetCreatorInfoQuery } from "store/services/UserService";
import { addNotFoundUserNotification } from "utils";
import { baseURL } from "consts";

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
      spamFilter,
    }: {
      username: string;
      spamFilter: boolean;
    }) => {
      const socket = io(baseURL, {
        path: "/sockt/",
        query: {
          username,
        },
      });

      socket.on("newDonat", async () => {
        getNotifications({
          username,
          limit: 1,
          spamFilter,
        });
      });
      return socket;
    };

    if (name && personInfo?.creator) {
      const socketUnlogin = setUnloginUserSocket({
        username: name,
        spamFilter: personInfo.creator?.spamFilter,
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
