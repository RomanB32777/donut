import { Row } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNotifications } from "../../../store/types/Notifications";
import { getNotificationMessage } from "../../../utils";
import Loader from "../../Loader";
import "./styles.sass";

const NotificationsPopup = ({ user }: { user: number }) => {
  const dispatch = useDispatch();
  const notifications: any[] = useSelector((state: any) => state.notifications);
  const { isLoading } = useSelector((state: any) => state.loading);
  
  const [moreVisibleList, setMoreVisibleList] = useState(false);

  useEffect(() => {
    dispatch(getNotifications(user));
  }, [user]);

  const renderNotifList = (n: any) => (
    <div className="notifications-popup__content-item" key={n.id}>
      {n.donation &&
        getNotificationMessage(
          n.donation.creator_id === user ? "donat_creator" : "donat_supporter",
          n.donation.username,
          { sum: n.donation.sum_donation, blockchain: n.donation.blockchain }
        )}
      {n.badge &&
        getNotificationMessage(
          n.badge.creator_id === user
            ? "add_badge_creator"
            : "add_badge_supporter",
          n.badge.creator_id === user
            ? n.badge.supporter_username
            : n.badge.creator_username
          // n.badge.badge_name
        )}
    </div>
  );

  return (
    <div
      className="notifications-popup-wrapper"
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {isLoading ? (
        <Row justify="center">
          <Loader size="small" />
        </Row>
      ) : (
        <div className="notifications-popup__content">
          {Boolean(notifications.length) ? (
            <div
              className="notifications-popup__content-list"
              style={{
                overflowY: notifications.length >= 9 ? "scroll" : "auto",
              }}
            >
              {notifications &&
                Boolean(notifications.length) &&
                notifications.slice(0, 9).map(renderNotifList)}
              {moreVisibleList &&
                Boolean(notifications.length) &&
                notifications.slice(10).length &&
                notifications.slice(10).map(renderNotifList)}
            </div>
          ) : (
            <div
              className="notifications-popup__content-item"
              style={{
                textAlign: "center",
              }}
            >
              No notifications
            </div>
          )}
          {notifications.length >= 9 && (
            <div
              className="notifications-popup__content-link"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
                setMoreVisibleList(true);
              }}
            >
              Load more
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPopup;
