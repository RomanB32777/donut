import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Badge, Row } from "antd";
import { useDispatch } from "react-redux";
import { INotification } from "types";

import { useAppSelector } from "hooks/reduxHooks";
import useOnClickOutside from "hooks/useClickOutside";
import { AlertIcon } from "icons";
import Loader from "components/Loader";

import axiosClient from "modules/axiosClient";
import { getNotifications } from "store/types/Notifications";
import "./styles.sass";
import { NotificationItem } from "./components/NotificationItem";

const LIMIT_NOTIF = 10;

const NotificationsPopup = () => {
  const dispatch = useDispatch();
  const { notifications: notificationsApp, user } = useAppSelector(
    (state) => state
  );

  const contentRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalLength, setTotalLength] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [isNotificationPopupOpened, setNotificationPopupOpened] =
    useState(false);

  const { list } = notificationsApp;
  const { id: userID } = user;

  const handlerNotificationPopup = () =>
    setNotificationPopupOpened((prev) => !prev);

  useOnClickOutside(
    isNotificationPopupOpened,
    blockRef,
    handlerNotificationPopup
  );

  const handleScroll = useCallback(
    (e: Event) => {
      const listHeight = (e.currentTarget as HTMLDivElement).clientHeight;
      const listScrollTop = (e.currentTarget as HTMLDivElement).scrollTop;
      const listScrollHeight = (e.currentTarget as HTMLDivElement).scrollHeight;

      if (
        listScrollHeight - (listScrollTop + listHeight) <= 25 &&
        notifications.length < totalLength
      )
        setFetching(true);
    },
    [notifications, totalLength] // isNotificationPopupOpened ???
  );

  const getCurrentNotifications = async ({
    updatePage,
    currentPage,
  }: {
    updatePage?: boolean;
    currentPage: number;
  }) => {
    try {
      setLoading(true);
      const url = `/api/notification/${userID}?limit=${LIMIT_NOTIF}&offset=${
        LIMIT_NOTIF * currentPage
      }`; // &sort=read&sortDirection=ASC

      const { data, status } = await axiosClient.get(url);

      if (status === 200) {
        updatePage && setCurrentPage((prev) => prev + 1);
        setTotalLength(data.totalLength);
        setNotifications((prev) =>
          updatePage && currentPage
            ? [...prev, ...data.notifications]
            : data.notifications
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setFetching(false);
    }
  };

  const unreadedNotificationsCount = useMemo(() => {
    const all = list.length;

    // const unreadedApp = list.filter(
    //   (n: any) => !n[getNotificationUserRole(n.recipient)]
    // ).length;

    // const unreaded = notifications.filter(
    //   (n: any) => !n[getNotificationUserRole(n.recipient)]
    // ).length;

    // const readed = notifications.filter(
    //   (n: any) => n[getNotificationUserRole(n.recipient)]
    // ).length;

    // const currentUnreaded = list.filter(
    //   (na: any) =>
    //     !na[getNotificationUserRole(na.recipient)] &&
    //     notifications.some((n: any) => n.id === na.id)
    // );

    // if (unreadedApp === all && readed === 0) return unreadedApp;

    // if (!loading) {
    //   if (unreadedApp >= all - readed) return all - readed;

    //   if (currentUnreaded.length) return unreaded;

    //   if (unreadedApp > 0 && unreaded === 0 && notifications.length !== all)
    //     return unreadedApp - unreaded;
    // }

    return 0;
  }, [list, notifications, loading]);

  useEffect(() => {
    if (isNotificationPopupOpened) {
      dispatch(getNotifications({ user: userID, shouldUpdateApp: false }));
      setNotifications([]);
      setTotalLength(0);
      setCurrentPage(0);
      getCurrentNotifications({ currentPage: 0 });
    }
  }, [isNotificationPopupOpened, userID]);

  useEffect(() => {
    fetching &&
      userID &&
      getCurrentNotifications({ updatePage: true, currentPage });
  }, [userID, fetching, currentPage]);

  useEffect(() => {
    dispatch(getNotifications({ user: userID }));
  }, []);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (content) {
      content.addEventListener("scroll", handleScroll);
      return () => content.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  return (
    <div className="notifications" ref={blockRef}>
      <div
        className="icon icon-notifications"
        onClick={handlerNotificationPopup}
      >
        <Badge
          count={
            unreadedNotificationsCount > 0 ? unreadedNotificationsCount : 0
          }
        >
          <AlertIcon />
        </Badge>
      </div>

      {isNotificationPopupOpened && (
        <div className="popup">
          <div className="wrapper fadeIn">
            <div className="content">
              <div
                className="list"
                style={{
                  overflowY: notifications.length >= 9 ? "scroll" : "auto",
                }}
                ref={contentRef}
              >
                {notifications.map((n) => <NotificationItem notification={n} userID={userID} />)}
                {!Boolean(notifications.length) && !loading && (
                  <div
                    className="item"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <Badge dot={false} className="dot">
                      No notifications
                    </Badge>
                  </div>
                )}
                
                {loading && (
                  <Row justify="center">
                    <Loader size="small" />
                  </Row>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPopup;
