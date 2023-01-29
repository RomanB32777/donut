import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "antd";
import { useDispatch } from "react-redux";

import { useAppSelector } from "hooks/reduxHooks";
import useOnClickOutside from "hooks/useClickOutside";
import { NotificationItem } from "./components/NotificationItem";
import { AlertIcon } from "icons";

import axiosClient from "modules/axiosClient";
import { getNotifications, setNotifications } from "store/types/Notifications";
import "./styles.sass";

const NotificationsPopup = () => {
  const dispatch = useDispatch();
  const { notifications: notificationsApp, user } = useAppSelector(
    (state) => state
  );

  const contentRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef(null);

  const [isNotificationPopupOpened, setNotificationPopupOpened] =
    useState(false);

  const { list } = notificationsApp;
  const { id: userID } = user;

  const handlerNotificationPopup = () =>
    setNotificationPopupOpened((prev) => !prev);

  const clearAll = async () => {
    const { data, status } = await axiosClient.delete(
      `/api/notification/${userID}`
    );
    if (status === 200 && data) {
      dispatch(
        setNotifications({
          list: [],
          shouldUpdateApp: false,
        })
      );
    }
  };

  useOnClickOutside(
    isNotificationPopupOpened,
    blockRef,
    handlerNotificationPopup
  );

  const unreadedNotificationsCount = useMemo(
    () => list.filter(({ read }) => !read).length,
    [list]
  );

  useEffect(() => {
    isNotificationPopupOpened &&
      dispatch(getNotifications({ user: userID, shouldUpdateApp: false }));
  }, [isNotificationPopupOpened]);

  useEffect(() => {
    userID &&
      dispatch(getNotifications({ user: userID, shouldUpdateApp: false }));
  }, [userID]);

  return (
    <div className="notifications" ref={blockRef}>
      <div
        className="icon icon-notifications"
        onClick={handlerNotificationPopup}
      >
        <Badge count={unreadedNotificationsCount}>
          <AlertIcon />
        </Badge>
      </div>

      {isNotificationPopupOpened && (
        <div className="popup">
          <div className="wrapper fadeIn">
            {Boolean(list.length) && (
              <div className="popup-header">
                <p>Notifications</p>
                <p className="all-read" onClick={clearAll}>
                  Clear all
                </p>
              </div>
            )}
            <div className="content">
              <div
                className="list"
                style={{
                  overflowY: list.length >= 9 ? "scroll" : "auto",
                }}
                ref={contentRef}
              >
                {list.map((n) => (
                  <NotificationItem
                    key={n.id}
                    notification={n}
                    handlerNotificationPopup={handlerNotificationPopup}
                  />
                ))}
                {!Boolean(list.length) && (
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPopup;
