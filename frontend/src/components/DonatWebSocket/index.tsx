import { createContext, useEffect, useState, ReactNode } from "react";
import { useDispatch } from "react-redux";
import { io, Socket } from "socket.io-client";
import { baseURL, isProduction, socketsBaseUrl } from "../../modules/axiosClient";
import { getNotifications } from "../../store/types/Notifications";
import { useParams } from "react-router";

export const DonatWebSocketContext = createContext<Socket | null>(null);

const DonatWebSocketProvider = ({ children }: { children: ReactNode }) => {
  const { name } = useParams();
  const dispatch = useDispatch();
  const [valueContext, setValueContext] = useState<null | Socket>(null);

  const setUnloginUserSocket = (username: string) => {
    const socket = io(isProduction ? baseURL : socketsBaseUrl, {
      path: "/sockt/",
      query: {
        userName: username,
      },
    });

    socket.on("new_notification", (data) => {
      console.log(data);
      dispatch(getNotifications({ user: username }));
    });
    return socket;
  };

  useEffect(() => {
    if (name) {
      const socketUnlogin = setUnloginUserSocket(name);
      setValueContext(socketUnlogin);
      return () => {
        socketUnlogin.disconnect();
      };
    }
  }, [name]);
  // useEffect(() => console.log(valueContext), [valueContext]);

  return (
    <DonatWebSocketContext.Provider value={valueContext}>
      {children}
    </DonatWebSocketContext.Provider>
  );
};

export default DonatWebSocketProvider;
