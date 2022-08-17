import {
  AccountCircleIcon,
  BalanceWalletIcon,
  CheckIcon,
  DonutIcon,
  LogoutIcon,
  NotificationIcon,
  SmallToggleListArrowIcon,
  WalletIcon,
} from "../../icons/icons";
import "./styles.sass";

import LogoIcon from "../../icons/LogoIcon";
import Search from "../../components/Search";
import { useDispatch, useSelector } from "react-redux";
import getTronWallet, {
  getMetamaskWallet,
  metamaskWalletIsIntall,
  tronWalletIsIntall,
} from "../../functions/getTronWallet";
import { useNavigate } from "react-router";
import routes from "../../routes";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { url } from "../../consts";
import { setUser } from "../../store/types/User";
import {
  openAuthTronModal,
  openRegistrationModal,
} from "../../store/types/Modal";
import postData from "../../functions/postData";
import axiosClient, { baseURL } from "../../axiosClient";
import { addNotification, getNotificationMessage } from "../../utils";
import { getNotifications } from "../../store/types/Notifications";

import TronLinkIcon from "../../assets/tronlink.png";
import MetaMaskIcon from "../../assets/MetaMask_Fox.png";

import clsx from "clsx";
import { setMainWallet } from "../../store/types/Wallet";

const NotificationsPopup = ({ user }: { user: number }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notifications = useSelector((state: any) => state.notifications);

  useEffect(() => {
    dispatch(getNotifications(user));
  }, [user]);
  // console.log(notificationsList);

  return (
    <div
      className="notifications-popup-wrapper"
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="notifications-popup__content">
        {notifications &&
          Boolean(notifications.length) &&
          notifications.slice(0, 5).map((n: any) => (
            <div className="notifications-popup__content-item" key={n.id}>
              {n.donation &&
                getNotificationMessage(
                  n.donation.creator_id === user
                    ? "donat_creater"
                    : "donat_supporter",
                  n.donation.username,
                  n.donation.sum_donation
                )}
              {n.follow &&
                getNotificationMessage(
                  n.follow.creator_id === user
                    ? "following_creater"
                    : "following_backer",
                  n.follow.creator_id === user
                    ? n.follow.backer_username
                    : n.follow.creator_username
                )}
            </div>
          ))}
        <div
          className="notifications-popup__content-link"
          onClick={() => navigate(routes.notifications)}
        >
          Load more
        </div>
      </div>
    </div>
  );
};

const wallets = [
  {
    name: "TronLink",
    img: TronLinkIcon,
    isInstall: tronWalletIsIntall,
    getWallet: getTronWallet,
  },
  {
    name: "MetaMask",
    img: MetaMaskIcon,
    isInstall: metamaskWalletIsIntall,
    getWallet: getMetamaskWallet,
  },
];

const WalletPopup = ({
  user,
  checkIsExist,
}: {
  user: any;
  checkIsExist: any;
}) => {
  const [isOpenSelect, setOpenSelect] = useState(false);
  const dispatch = useDispatch();
  const mainWallet = useSelector((state: any) => state.wallet);

  return (
    <div className="wallet-popup-wrapper">
      <div className="wallet-popup__header">
        <div className="wallet-popup__header__image">
          {user.avatarlink && user.avatarlink.length > 0 ? (
            <img src={url + user.avatarlink} alt="" />
          ) : (
            <></>
          )}
        </div>
        <div
          className="wallet-popup__header__info"
          onClick={() => {
            setOpenSelect(!isOpenSelect);
          }}
        >
          <span className="wallet-popup__header__info__name">My wallets</span>
          <div className={clsx({ rotated: isOpenSelect })}>
            <SmallToggleListArrowIcon />
          </div>
          {isOpenSelect && (
            <div className="wallet-popup__select_wallet">
              {wallets.map(({ name, img, isInstall, getWallet }, key) => (
                <div className="wallet-popup__select_wallet-item" key={key}>
                  <div
                    className="wallet-popup__select_wallet-item__content"
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (isInstall()) {
                        const walletToken = await getWallet();
                        if (walletToken) {
                          const walletData = {
                            wallet: name,
                            token: walletToken,
                          };
                          dispatch(setMainWallet(walletData));
                          localStorage.setItem(
                            "main_wallet",
                            JSON.stringify(walletData)
                          );
                        } else {
                          addNotification({
                            type: "danger",
                            title: `${name} error`,
                            message: `An error occurred while authorizing the wallet in ${name}`,
                          });
                        }
                      } else {
                        dispatch(openAuthTronModal());
                      }
                    }}
                  >
                    <img
                      className="wallet-popup__select_wallet-item__img"
                      src={img}
                      alt=""
                    />
                    <span className="wallet-popup__select_wallet-item__name">
                      {name}
                    </span>
                  </div>
                  {mainWallet.wallet === name && <CheckIcon />}
                </div>
              ))}
              <div className="wallet-popup__select_wallet-item">
                <div className="wallet-popup__select_wallet-item__content">
                  <div className="wallet-popup__select_wallet-item__img">
                    <LogoutIcon />
                  </div>
                  <span className="wallet-popup__select_wallet-item__name">
                    Sign-out
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="wallet-popup__content">
          <div className="wallet-popup__content-balance">
            <span className="balance_title">Total balance</span>
            <span className="balance_sum">$10,00</span>
          </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.user);

  const checkIsExist = async (token: string) => {
    postData("/api/user/check-user-exist/", { tron_token: token }).then(
      (data) => {
        if (data.notExist) {
          dispatch(openRegistrationModal());
        } else {
          navigate(routes.profile);
        }
      }
    );
  };

  const [isProfilePopupOpened, setProfilePopupOpened] =
    useState<boolean>(false);

  const [isWalletPopupOpened, setWalletPopupOpened] = useState<boolean>(false);

  const [isNotificationPopupOpened, setNotificationPopupOpened] =
    useState<boolean>(false);

  const popupTitles =
    user.roleplay === "creators"
      ? [
          {
            title: "My profile",
            link: "/creator/" + user.username,
          },
          {
            title: "Account",
            link: routes.profile,
          },
          {
            title: "Collections",
            link: routes.nft,
          },
          {
            title: "Supporters",
            link: routes.supporters,
          },
          {
            title: "Badges",
            link: routes.badges,
          },
          {
            title: "Followers",
            link: routes.followers,
          },
          {
            title: "Sign out",
            link: routes.main,
          },
        ]
      : [
          {
            title: "Account",
            link: routes.profile,
          },
          {
            title: "Transactions",
            link: routes.transactions,
          },
          {
            title: "Badges",
            link: routes.badges,
          },
          {
            title: "Following",
            link: routes.following,
          },
          {
            title: "Sign out",
            link: routes.main,
          },
        ];

  useEffect(() => {
    const clickHandler = (event: any) => {
      if (
        event.target &&
        event.target.className &&
        event.target.className.includes("profile-popup")
      ) {
        return true;
      } else {
        setProfilePopupOpened(false);
      }

      if (
        event.target &&
        event.target.className &&
        event.target.className.includes("wallet-popup")
      ) {
        return true;
      } else {
        setWalletPopupOpened(false);
      }

      if (
        event.target &&
        event.target.className &&
        event.target.className.includes("notifications-popup")
      ) {
        return true;
      } else {
        setNotificationPopupOpened(false);
      }
    };
    document.addEventListener("click", clickHandler);

    return () => {
      document.removeEventListener("click", clickHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="navbar-wrapper">
        <div className="navbar">
          <div className="navbar__left-side">
            <div
              onClick={() => navigate(routes.main)}
              style={{
                cursor: "pointer",
              }}
            >
              <LogoIcon />
            </div>

            <div className="navbar__left-side__submenu">
              <Link to={routes.creators}>Creators</Link>
              <Link to={routes.backers}>Supporters</Link>
            </div>

            <div>
              <Search />
            </div>
          </div>

          <div className="navbar__right-side">
            {user && user.roleplay && user.roleplay === "creators" && (
              <div
                onClick={() => {
                  if (user.roleplay === "creators") {
                    navigate(routes.supporters);
                  }
                }}
                className="donut"
              >
                <DonutIcon />
              </div>
            )}
            {user && user.id && (
              <div
                className="icon"
                onClick={async () => {
                  if (user && user.id) {
                    setNotificationPopupOpened(true);
                    setProfilePopupOpened(false);
                    setWalletPopupOpened(false);
                  }
                }}
              >
                <NotificationIcon />
              </div>
            )}
            <div
              onClick={() => {
                if (tronWalletIsIntall()) {
                  const wallet = getTronWallet();
                  if (user && user.id) {
                    setProfilePopupOpened(true);
                    setNotificationPopupOpened(false);
                    setWalletPopupOpened(false);
                  } else {
                    if (wallet) {
                      checkIsExist(wallet);
                    } else {
                      dispatch(openRegistrationModal());
                    }
                  }
                } else {
                  dispatch(openAuthTronModal());
                }
              }}
              className="icon"
            >
              <AccountCircleIcon />
            </div>
            {user && user.id && (
              <div
                onClick={() => {
                  setWalletPopupOpened(true);
                  setNotificationPopupOpened(false);
                  setProfilePopupOpened(false);
                }}
                className="icon"
              >
                <BalanceWalletIcon />
              </div>
            )}
          </div>

          {isNotificationPopupOpened && user.id && (
            <NotificationsPopup user={user.id} />
          )}

          {isProfilePopupOpened && user.id && (
            <div
              className="profile-popup-wrapper"
              style={{
                height: user.roleplay === "creators" ? "395px" : "305px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div className="profile-popup__header">
                <div className="profile-popup__header__image">
                  {user.avatarlink && user.avatarlink.length > 0 ? (
                    <img src={url + user.avatarlink} alt="" />
                  ) : (
                    <></>
                  )}
                </div>
                <div className="profile-popup__header__info">
                  <span className="profile-popup__header__info__name">
                    {user.person_name && user.person_name.length > 0 ? (
                      user.person_name
                    ) : (
                      <>Person Name</>
                    )}
                  </span>
                  <span className="profile-popup__header__info__username">
                    {user.username}
                  </span>
                </div>
              </div>

              <div className="profile-popup__main">
                {popupTitles.map((title, index) => (
                  <div
                    key={"profile-popup__link" + index}
                    className="profile-popup__main__link"
                    style={{
                      borderBottom:
                        index === popupTitles.length - 1
                          ? "none"
                          : "1px solid #000000",
                    }}
                    onClick={() => {
                      if (title.title === "Sign out") {
                        dispatch(setUser(""));
                      }
                      navigate(title.link);
                    }}
                  >
                    {title.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {isWalletPopupOpened && user.id && (
        <WalletPopup user={user} checkIsExist={checkIsExist} />
      )}
    </>
  );
};

export default Navbar;
