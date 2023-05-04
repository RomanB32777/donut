import { createContext, useEffect, useState, ReactNode } from "react";
import { useParams } from "react-router";
import { io, Socket } from "socket.io-client";

import { useLazyGetNotificationsQuery } from "store/services/NotificationsService";
import { useGetCreatorInfoQuery } from "store/services/UserService";
import { useLazyGetAlertWidgetDataQuery } from "store/services/AlertsService";
import { useLazyGetGoalsWidgetDataQuery } from "store/services/GoalsService";
import { useLazyGetStatsWidgetDataQuery } from "store/services/StatsService";
import { addNotFoundUserNotification } from "utils";
import { baseURL } from "consts";
import { ISocketNotification } from "types";

export const DonateWebSocketContext = createContext<Socket | null>(null);

const DonateWebSocketProvider = ({ children }: { children: ReactNode }) => {
  const { name, id: widgetId } = useParams();
  const [getNotifications] = useLazyGetNotificationsQuery({
    refetchOnFocus: false,
  });
  const [getGoalWidget] = useLazyGetGoalsWidgetDataQuery();
  const [getAlertWidget] = useLazyGetAlertWidgetDataQuery();
  const [getStatWidget] = useLazyGetStatsWidgetDataQuery();

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

      socket.on("newDonate", async () => {
        getNotifications({
          username,
          limit: 1,
          spamFilter,
        });
      });

      socket.on("widgetChange", async ({ type }: ISocketNotification) => {
        if (!widgetId) return;

        switch (type) {
          case "change_alert":
            getAlertWidget(widgetId);
            break;

          case "change_goal":
            getGoalWidget({ username, id: widgetId });
            break;

          case "change_stat":
            getStatWidget(widgetId);
            break;

          default:
            break;
        }
      });

      // socket.on("newDonate", (data: ISocketNotification) => {
      //   addNotification({
      //     type: "info",
      //     title: intl.formatMessage({ id: "notifications_donate_title" }),
      //     message: getDonateNotificationMessage({
      //       type: "donate_creator",
      //       user: data.supporter,
      //       data: data.additional,
      //     }),
      //   });
      //   getNotifications({ username });
      // });

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
    <DonateWebSocketContext.Provider value={valueContext}>
      {children}
    </DonateWebSocketContext.Provider>
  );
};

export default DonateWebSocketProvider;
