import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Badge, Row } from "antd";
import { useDispatch } from "react-redux";
import { InView } from "react-intersection-observer";
import dayjsModule from "modules/dayjsModule";

import { useAppSelector } from "hooks/reduxHooks";
import { WalletContext } from "contexts/Wallet";
import { AlertIcon } from "icons";
import Loader from "components/Loader";

import axiosClient, { baseURL } from "modules/axiosClient";
import { getNotifications } from "store/types/Notifications";
import { getNotificationMessage } from "utils";
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
  const dispatch = useDispatch();
  const { list } = useAppSelector(({ notifications }) => notifications);
  const { walletConf } = useContext(WalletContext);

  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalLength, setTotalLength] = useState(0);
  const [fetching, setFetching] = useState(false);

  const checkIsRecipient = (recipient: number) => recipient === user;

  const getNotificationUserRole = (recipient: number) =>
    checkIsRecipient(recipient) ? "read_recipient" : "read_sender";

  const updateNotification = async ({ id, read }: INotificationStatus) => {
    const { data, status } = await axiosClient.put(
      `${baseURL}/api/notification/status`,
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
              const readField = getNotificationUserRole(n.recipient);
              if (n.id === id) {
                return {
                  ...n,
                  [readField]: updatedNotification[readField],
                };
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

  const getCurrentNotifications = async ({
    updatePage,
    currentPage,
  }: {
    updatePage?: boolean;
    currentPage: number;
  }) => {
    try {
      setLoading(true);
      const currBlockchain = await walletConf.getCurrentBlockchain();

      if (currBlockchain) {
        const url = `${baseURL}/api/notification/${user}?blockchain=${
          currBlockchain.name
        }&limit=${LIMIT_NOTIF}&offset=${LIMIT_NOTIF * currentPage}`; // &sort=read&sortDirection=ASC

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
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setFetching(false);
    }
  };

  useEffect(() => {
    if (isNotificationPopupOpened) {
      dispatch(getNotifications({ user, shouldUpdateApp: false }));
      setNotifications([]);
      setTotalLength(0);
      setCurrentPage(0);
      getCurrentNotifications({ currentPage: 0 });
    }
  }, [isNotificationPopupOpened, user]);

  useEffect(() => {
    fetching &&
      user &&
      getCurrentNotifications({ updatePage: true, currentPage });
  }, [user, fetching, currentPage]);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (content) {
      content.addEventListener("scroll", handleScroll);
      return () => content.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const unreadedNotificationsCount = useMemo(() => {
    const all = list.length;

    const unreadedApp = list.filter(
      (n: any) => !n[getNotificationUserRole(n.recipient)]
    ).length;

    const unreaded = notifications.filter(
      (n: any) => !n[getNotificationUserRole(n.recipient)]
    ).length;

    const readed = notifications.filter(
      (n: any) => n[getNotificationUserRole(n.recipient)]
    ).length;

    const currentUnreaded = list.filter(
      (na: any) =>
        !na[getNotificationUserRole(na.recipient)] &&
        notifications.some((n: any) => n.id === na.id)
    );

    if (unreadedApp === all && readed === 0) return unreadedApp;

    if (!loading) {
      if (unreadedApp >= all - readed) return all - readed;

      if (currentUnreaded.length) return unreaded;

      if (unreadedApp > 0 && unreaded === 0 && notifications.length !== all)
        return unreadedApp - unreaded;
    }

    return 0;
  }, [list, notifications, loading]);

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
      <InView
        onChange={handleChange({
          id: n.id,
          read: n[getNotificationUserRole(n.recipient)],
        })}
        key={n.id}
      >
        {({ ref }) => (
          <div className="notifications-popup__content-item" ref={ref}>
            <Badge
              dot={!n[getNotificationUserRole(n.recipient)]}
              className="dot"
            >
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
                {dayjsModule(n.created_at).startOf("minutes").fromNow()}
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
        <div className="popup">
          <div className="wrapper">
            <div className="content">
              <div
                className="list"
                style={{
                  overflowY: notifications.length >= 9 ? "scroll" : "auto",
                }}
                ref={contentRef}
              >
                {notifications.map(renderNotifList)}
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
