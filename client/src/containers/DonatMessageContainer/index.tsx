import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { MaticIcon, TronIcon } from "../../icons/icons";
import { tryToGetPersonInfo } from "../../store/types/PersonInfo";

import bigImg from "../../assets/big_don.png";
import "./styles.sass";

const DonatMessageContainer = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const notifications = useSelector((state: any) => state.notifications);

  const [lastNotif, setLastNotif] = useState<any>({});

  useEffect(() => {
    notifications.length && setLastNotif(notifications[0].donation);
    setTimeout(() => {
      setLastNotif({});
    }, 5000);

    // return clearTimeout(timeout);
  }, [notifications]);

  useEffect(() => {
    const pathnameEnd = pathname.slice(pathname.indexOf("@"));

    dispatch(
      tryToGetPersonInfo({
        username: pathnameEnd.slice(0, pathnameEnd.indexOf("/")),
      })
    );

    const pageContainer = document.querySelector(".container");
    const navbar = document.querySelector(".navbar-wrapper");
    const navbarBanner = document.querySelector(".navbar-banner");
    const footer = document.querySelector(".footer");

    if (navbar && navbarBanner && footer && pageContainer) {
      [navbar, navbarBanner, footer].forEach((el) => {
        el.classList.add("hidden");
      });
      pageContainer.classList.add("transparent");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="donat-messsage-container">
      {Boolean(Object.keys(lastNotif).length) && (
        <>
          <img src={bigImg} alt="" />
          <div className="donat-messsage-container_title">
            <span>
              {lastNotif.username && lastNotif.sum_donation && (
                <>
                  {lastNotif.username} - {lastNotif.sum_donation}{" "}
                </>
              )}
              {lastNotif.wallet_type === "tron" && "TRX"}{" "}
              {lastNotif.wallet_type === "metamask" && "MATIC"}
            </span>
            {lastNotif.wallet_type === "tron" && <TronIcon />}
            {lastNotif.wallet_type === "metamask" && <MaticIcon />}
          </div>
          <p className="donat-messsage-container_message">
            {lastNotif.donation_message}
          </p>
        </>
      )}
    </div>
  );
};

export default DonatMessageContainer;
