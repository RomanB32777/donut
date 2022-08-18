import clsx from "clsx";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../../axiosClient";
import PageTitle from "../../commonComponents/PageTitle";
import { SmallToggleListArrowIcon } from "../../icons/icons";
import { getNotifications } from "../../store/types/Notifications";
import { DateFormatter } from "../../utils";
import "./styles.sass";

const tableHeaderTitles = [
  { title: "username" },
  { title: "usd", sorting: false },
  { title: "message" },
  { title: "date", sorting: false },
];

const NotificationsContainer = () => {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const notifications = useSelector((state: any) => state.notifications);

  const [sortingState, setSortingState] = useState<any>({
    type: "",
    sort: "UP",
  });

  const [permissionsNotif, setPermissionsNotif] = useState(false);

  useEffect(() => {
    if (user.id) {
      dispatch(getNotifications(user.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const [tronUsdtKoef, setTronUsdtKoef] = useState<number>(0);

  const getPrice = async () => {
    const res: any = await axiosClient.get(
      "https://www.binance.com/api/v3/ticker/price?symbol=TRXUSDT"
    );
    setTronUsdtKoef(res.data.price);
  };

  useEffect(() => {
    getPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sort = (type: string) => {
    console.log(type);
  };

  const browserNotify = () => {
    // Проверка поддержки браузером уведомлений
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return;
    }

    permissionsNotif
      ? setPermissionsNotif(!permissionsNotif)
      : Notification.requestPermission((permission) => {
          // Если пользователь разрешил, то создаём уведомление
          if (permission === "granted") {
            new Notification("Уведомления разрешены!");
            setPermissionsNotif(true);
          } else {
            setPermissionsNotif(false);
          }
        });
    // }
  };

  useEffect(() => {
    if ("Notification" in window) {
      const storagePermission = localStorage.getItem("permissionsNotif");
      if (storagePermission) {
        storagePermission === "true"
          ? setPermissionsNotif(true)
          : setPermissionsNotif(false);
      } else
        Notification.permission === "granted"
          ? setPermissionsNotif(true)
          : setPermissionsNotif(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("permissionsNotif", String(permissionsNotif));
  }, [permissionsNotif]);

  return (
    <div className="notifications-container">
      <PageTitle formatId="page_title_notifications" />
      <div className="notifications-container__permissions">
        <span>Donation alerts</span>
        <button
          onClick={browserNotify}
          className={permissionsNotif ? "on" : "off"}
        >
          {permissionsNotif ? "On" : "Off"}
        </button>
      </div>
      <div className="notifications-container__table">
        <div className="notifications-container__table__header">
          {tableHeaderTitles.map(({ title, sorting }) => (
            <div
              key={"notifications_page_table_header_" + title}
              className={clsx({
                "notifications-container__table__header_flex": sorting,
              })}
              onClick={() => {
                if (sorting) sort(title);
              }}
            >
              <FormattedMessage
                id={"notifications_page_table_header_" + title}
              />
              {sorting && (
                <div
                  className={
                    sortingState.type === title && sortingState.sort === "DOWN"
                      ? "rotated"
                      : ""
                  }
                >
                  <SmallToggleListArrowIcon />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="notifications-container__table__main">
          {notifications &&
            Boolean(notifications.length) &&
            notifications
              .filter((row: any) => row.donation !== null)
              .map((row: any, rowIndex: number) => (
                <div
                  className="notifications-container__table__main__row"
                  key={"notifications-container__table__main__row" + rowIndex}
                >
                  <span>{row.donation.username}</span>
                  <span>
                    {"$ " +
                      Math.round(
                        parseFloat(row.donation.sum_donation) * tronUsdtKoef
                      )}
                  </span>
                  <span>{row.donation.donation_message}</span>

                  <span className="notifications-container__table__main__row__info-icon">
                    {DateFormatter(row.creation_date, "MMMM D, YYYY/ HH:mm")}
                  </span>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsContainer;
