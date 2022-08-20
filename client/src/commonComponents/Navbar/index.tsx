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
  getMetamaskData,
  getMetamaskWallet,
  metamaskWalletIsIntall,
  tronWalletIsIntall,
} from "../../functions/getTronWallet";
import { useNavigate } from "react-router";
import routes from "../../routes";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { url } from "../../consts";
import { setUser, tryToGetUser } from "../../store/types/User";
import {
  openAuthMetamaskModal,
  openAuthTronModal,
  openAuthWalletsModal,
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
import Web3 from "web3";
import { ethers } from "ethers";

const NotificationsPopup = ({ user }: { user: number }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notifications = useSelector((state: any) => state.notifications);
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
          { sum: n.donation.sum_donation, wallet: n.donation.wallet_type }
        )}
      {n.follow &&
        getNotificationMessage(
          n.follow.creator_id === user
            ? "following_creator"
            : "following_backer",
          n.follow.creator_id === user
            ? n.follow.backer_username
            : n.follow.creator_username
        )}
      {n.badge &&
        getNotificationMessage(
          n.badge.owner_user_id === user
            ? "add_badge_creator"
            : "add_badge_supporter",
          n.badge.owner_user_id === user
            ? n.badge.supporter_username
            : n.badge.creator_username,
          n.badge.badge_name
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
      <div className="notifications-popup__content">
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
        <div
          className="notifications-popup__content-link"
          onClick={() => setMoreVisibleList(true)}
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
    type: "tron",
    img: TronLinkIcon,
    isInstall: tronWalletIsIntall,
    getWallet: getTronWallet,
    openAuthModal: openAuthTronModal,
  },
  {
    name: "MetaMask",
    type: "metamask",
    img: MetaMaskIcon,
    isInstall: metamaskWalletIsIntall,
    getWallet: getMetamaskWallet,
    openAuthModal: openAuthMetamaskModal,
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
  const [totalBalance, setTotalBalance] = useState<number>(0);

  const dispatch = useDispatch();
  const mainWallet = useSelector((state: any) => state.wallet);
  const navigate = useNavigate();

  const getTronUsdKoef = async () => {
    const res: any = await axiosClient.get(
      "https://www.binance.com/api/v3/ticker/price?symbol=TRXUSDT"
    );
    return res.data.price;
  };

  const getMaticUsdKoef = async () => {
    const res: any = await axiosClient.get(
      "https://www.binance.com/api/v3/ticker/price?symbol=MATICUSDT"
    );
    return res.data.price;
  };

  useEffect(() => {
    const walletData = localStorage.getItem("main_wallet");
    if (walletData) {
      dispatch(setMainWallet(JSON.parse(walletData)));
    }

    const clickHandler = (event: any) => {
      if (
        event.target &&
        event.target.className &&
        (event.target.className.includes("select_wallet") ||
          event.target.className.includes("popup__header"))
      ) {
        return true;
      } else {
        setOpenSelect(false);
      }
    };
    document.addEventListener("click", clickHandler);

    return () => {
      document.removeEventListener("click", clickHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBalance = async () => {
    if (
      mainWallet.wallet === "tron" &&
      tronWalletIsIntall() &&
      getTronWallet()
    ) {
      const tronWeb = (window as any).tronWeb;
      const tronBalance = await tronWeb.trx.getBalance(getTronWallet());
      if (tronBalance) {
        const formatTronBalance = tronWeb.fromSun(tronBalance);
        const tronUsdKoef: number = await getTronUsdKoef();
        setTotalBalance(
          Number((parseFloat(formatTronBalance) * tronUsdKoef).toFixed(2))
        );
      }
    }
    if (mainWallet.wallet === "metamask" && metamaskWalletIsIntall()) {
      const metamaskWallet = await getMetamaskWallet();
      if (metamaskWallet) {
        const metamaskData = await getMetamaskData();
        if (metamaskData) {
          const { provider, address } = metamaskData;
          const balance = await provider.getBalance(address);
          const maticUsdKoef: number = await getMaticUsdKoef();
          if (balance) {
            const newSumKoef =
              Number(ethers.utils.formatEther(balance.toString())) *
              maticUsdKoef;
            setTotalBalance(Number(newSumKoef.toFixed(2)));
          }
        }
      }
    }
  };

  useEffect(() => {
    getBalance();
  }, [mainWallet]);

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
              {wallets.map(
                (
                  { name, type, img, isInstall, getWallet, openAuthModal },
                  key
                ) => (
                  <div className="wallet-popup__select_wallet-item" key={key}>
                    <div
                      className="wallet-popup__select_wallet-item__content"
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (isInstall()) {
                          const walletToken = await getWallet();
                          if (walletToken) {
                            if (user[`${type}_token`]) {
                              const walletData = {
                                wallet: type,
                                token: walletToken,
                              };
                              dispatch(setMainWallet(walletData));
                              localStorage.setItem(
                                "main_wallet",
                                JSON.stringify(walletData)
                              );
                            } else {
                              addNotification({
                                type: "warning",
                                title: `Authorization is required`,
                                message: `Authorization of the ${name} wallet on the account page is required`,
                              });
                            }
                          } else {
                            addNotification({
                              type: "danger",
                              title: `${name} error`,
                              message: `An error occurred while authorizing the wallet in ${name}`,
                            });
                          }
                        } else {
                          dispatch(openAuthModal());
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
                    {mainWallet.wallet === type && <CheckIcon />}
                  </div>
                )
              )}
              <div className="wallet-popup__select_wallet-item">
                <div
                  className="wallet-popup__select_wallet-item__content"
                  onClick={() => {
                    dispatch(setUser(""));
                    localStorage.removeItem("main_wallet");
                    navigate(routes.main);
                  }}
                >
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
          <span className="balance_sum">${totalBalance}</span>
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
    postData("/api/user/check-user-exist/", { token }).then((data) => {
      if (data.notExist) {
        dispatch(openRegistrationModal());
      } else {
        dispatch(tryToGetUser(token));
        navigate(routes.profile);
      }
    });
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
            title: "Alerts",
            link: routes.notifications,
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
      <div className="navbar-banner">
        Beta version. Working on Tron Nile Testnet and Polygon Mumbai Testnet
      </div>
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
                if (
                  tronWalletIsIntall() &&
                  metamaskWalletIsIntall() &&
                  !user.id
                ) {
                  dispatch(openAuthWalletsModal());
                } else if (tronWalletIsIntall() || metamaskWalletIsIntall()) {
                  const wallet = tronWalletIsIntall()
                    ? getTronWallet()
                    : getMetamaskWallet();
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
                  dispatch(openAuthWalletsModal());
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
                height: user.roleplay === "creators" ? "440px" : "305px",
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
                        localStorage.removeItem("main_wallet");
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
