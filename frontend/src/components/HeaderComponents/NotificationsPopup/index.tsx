import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Badge, Row } from "antd";
import { useSelector } from "react-redux";
import { InView } from "react-intersection-observer";
import moment from "moment";
import Loader from "../../Loader";
import {
  currBlockchain,
  DateTimezoneFormatter,
  getNotificationMessage,
} from "../../../utils";
import axiosClient, { baseURL } from "../../../axiosClient";
import { AlertIcon } from "../../../icons/icons";
import "./styles.sass";

const LIMIT_NOTIF = 10;

interface INotificationStatus {
  id: number;
  read: boolean;
}

const NotificationsPopup = ({
  user,
  isNotificationPopupOpened,
  handlerNotificationPopup,
}: {
  user: number;
  isNotificationPopupOpened: boolean;
  handlerNotificationPopup: (e: React.MouseEvent<HTMLDivElement>) => void;
}) => {
  const notificationsApp = useSelector((state: any) => state.notifications);

  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalLength, setTotalLength] = useState(0);
  const [fetching, setFetching] = useState(true);

  const updateNotification = async ({ id, read }: INotificationStatus) => {
    const { data, status } = await axiosClient.put(
      `${baseURL}/api/user/notifications/status`,
      {
        id,
        read,
      }
    );
    if (status === 200) return data.updatedNotification;
  };

  const handleChange =
    ({ id, read }: INotificationStatus) =>
    async (status: boolean) => {
      if (!status) return;
      if (status && !read) {
        const updatedNotification = await updateNotification({
          id,
          read: status,
        });
        if (updatedNotification) {
          setNotifications((prev) =>
            prev.map((n: any) => {
              if (n.id === id) {
                return { ...n, read: updatedNotification.read };
              }
              return n;
            })
          );
        }
      }
    };

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
    [notifications, totalLength, isNotificationPopupOpened]
  );

  useEffect(() => {
    const getNotifications = async () => {
      try {
        setLoading(true);
        const url = `${baseURL}/api/user/notifications/${user}?blockchain=${
          currBlockchain?.nativeCurrency.symbol
        }&limit=${LIMIT_NOTIF}&offset=${LIMIT_NOTIF * currentPage}`; // &sort=read&sortDirection=ASC

        const { data, status } = await axiosClient.get(url);

        if (status === 200) {
          setCurrentPage((prev) => prev + 1);
          setTotalLength(data.totalLength);
          setNotifications([...notifications, ...data.notifications]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        setFetching(false);
      }
    };

    if (fetching) {
      getNotifications();
    }
  }, [user, fetching, currentPage]);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (content) {
      content.addEventListener("scroll", handleScroll);
      return () => content.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const unreadedNotificationsCount = useMemo(() => {
    const all = notificationsApp.length;
    const unreadedApp = notificationsApp.filter((n: any) => !n.read).length;
    const unreaded = notifications.filter((n: any) => !n.read).length;
    const readed = notifications.filter((n: any) => n.read).length;
    if (unreadedApp === all && readed === 0) return unreadedApp;

    if (
      unreaded > 0 ||
      (notifications.length >= readed && unreadedApp > all - readed)
    )
      return all - readed;

    if (unreadedApp > 0 && unreaded === 0 && notifications.length !== all)
      return unreadedApp - unreaded;

    return 0;
  }, [notificationsApp, notifications]);

  const renderNotifList = (n: any) => {
    const isNotificationBadgeStatus = n.badge && n.recipient === n.sender;
    const badgeType =
      n.badge &&
      (isNotificationBadgeStatus
        ? n.badge.transaction_status !== "pending" &&
          `${n.badge.transaction_status}_badge`
        : n.badge.creator_id === user
        ? "add_badge_creator"
        : "add_badge_supporter");

    const badgeData =
      n.badge &&
      n.badge.transaction_status !== "pending" &&
      (n.badge.transaction_status === "success"
        ? n.badge.id
        : n.badge.transaction_hash);

    return (
      <InView onChange={handleChange({ id: n.id, read: n.read })} key={n.id}>
        {({ ref }) => (
          <div className="notifications-popup__content-item" ref={ref}>
            <Badge dot={!n.read} className="dot">
              {n.donation &&
                getNotificationMessage({
                  type:
                    n.donation.creator_id === user
                      ? "donat_creator"
                      : "donat_supporter",
                  user: n.donation.username,
                  data: {
                    sum: n.donation.sum_donation,
                    blockchain: n.donation.blockchain,
                  },
                })}
              {n.badge &&
                getNotificationMessage({
                  type: badgeType,
                  user:
                    n.badge.creator_id === user
                      ? n.badge.supporter_username
                      : n.badge.creator_username,
                  // n.badge.badge_name
                  data: badgeData,
                })}
              <p className="date">
                {
                  moment(DateTimezoneFormatter(n.creation_date))
                    .startOf("minutes")
                    .fromNow()
                  // .format('DD MMMM YYYY, hh:mm')
                }
              </p>
            </Badge>
          </div>
        )}
      </InView>
    );
  };

  return (
    <div className="notifications">
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
        <div
          className="notifications-popup-wrapper"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="notifications-popup__content">
            <div
              className="notifications-popup__content-list"
              style={{
                overflowY: notifications.length >= 9 ? "scroll" : "auto",
              }}
              ref={contentRef}
            >
              {notifications.map(renderNotifList)}
              {!Boolean(notifications.length) && !loading && (
                <div
                  className="notifications-popup__content-item"
                  style={{
                    textAlign: "center",
                  }}
                >
                  No notifications
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
      )}
    </div>
  );
};

export default NotificationsPopup;
