import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { BackTop, Layout, Menu } from "antd";
import DocumentTitle from "react-document-title";
import clsx from "clsx";

import { IRoute, Pages, routers } from "../../routes";
import DonutzLogo from "../../assets/DonutzLogo.png";
import {
  AlertIcon,
  EmailIcon,
  LogoutIcon,
  SmallToggleListArrowIcon,
} from "../../icons/icons";
import { url } from "../../consts";

import { getNotifications } from "../../store/types/Notifications";
import { getNotificationMessage } from "../../utils";
import "./styles.sass";
import SelectComponent from "../../components/SelectComponent";
import { setUser } from "../../store/types/User";

const { Header, Content, Sider } = Layout;

const getItem = ({
  label,
  path,
  icon,
  children,
}: {
  label: any;
  path: any;
  icon: any;
  children?: any;
}) => ({
  key: path,
  icon: icon || null,
  children,
  label,
});

const HeaderSelect = ({
  user,
  isOpenSelect,
  setOpenSelect,
}: {
  user: any;
  isOpenSelect: boolean;
  setOpenSelect: (status: boolean) => void;
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [] = useState(false);
  return (
    <div className="header-select">
      <div className="header-select__image">
        {user.avatarlink ? <img src={url + user.avatarlink} alt="" /> : <></>}
      </div>
      <div
        className="header-select__info"
        onClick={() => {
          setOpenSelect(!isOpenSelect);
        }}
      >
        <span className="header-select__info__name">{user.username}</span>
        <div
          className={clsx("icon", "header-select__info__icon", {
            rotated: isOpenSelect,
          })}
        >
          <SmallToggleListArrowIcon />
        </div>
      </div>
      {isOpenSelect && (
        <div className="header-select__info-popup">
          <div className="header-select__info-item">
            <div
              className="header-select__info-item__content"
              onClick={() => {
                setOpenSelect(false);
                dispatch(setUser(""));
                localStorage.removeItem("main_wallet");
                navigate("/");
              }}
            >
              <div className="header-select__info-item__img">
                <LogoutIcon />
              </div>
              <span className="header-select__info-item__name">Sign-out</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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

const addToMenu = (
  route: IRoute,
  menuArr: IRoute[],
  user: any,
  iter: number = 0
) => {
  const add = () => {
    if (route.children) {
      iter++;
      route.children.forEach((chRoute) => {
        chRoute.menu && iter !== 3 && menuArr.push(chRoute);
        addToMenu(chRoute, menuArr, user, iter);
      });
    }
  };
  route.roleRequired ? route.roleRequired === user.roleplay && add() : add();
};

const LayoutApp = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const user = useSelector((state: any) => state.user);

  const menuItems: IRoute[] = useMemo(
    () =>
      routers.reduce((acc, route) => {
        route.protected
          ? user.id && addToMenu(route, acc, user)
          : addToMenu(route, acc, user);
        return acc;
      }, [] as IRoute[]),
    [user]
  );

  const activeRoute: string = useMemo(
    () =>
      pathname[0] === "/" && pathname !== "/"
        ? pathname.replace("/", "")
        : pathname,
    [pathname]
  );

  const [isNotificationPopupOpened, setNotificationPopupOpened] =
    useState<boolean>(false);

  const [isOpenHeaderSelect, setIsOpenHeaderSelect] = useState<boolean>(false);
  const hiddenLayoutElements: boolean = useMemo(() => {
    const pathsWithHiddenLayoutElements = routers.filter(
      (route) => route.hiddenLayoutElements
    );
    return pathsWithHiddenLayoutElements.some(
      (route) => pathname.split("/")[1] === route.path?.split("/")[0]
    );
  }, [pathname]);

  const noPaddingMainConteiner: boolean = useMemo(() => {
    const pathsWithoutPaddingMainConteiner = routers.filter(
      (route) => route.noPaddingMainConteiner
    );
    return pathsWithoutPaddingMainConteiner.some(
      (route) => pathname.split("/")[1] === route.path?.split("/")[0]
    );
  }, [pathname]);

  const titleApp: string | undefined = useMemo(() => {
    const routersWithChild = menuItems.filter((route) =>
      Boolean(route.children)
    );

    const childRouters = routersWithChild.map((route) => route.children);

    const allRouters: IRoute[] = menuItems.concat(
      ...(childRouters as IRoute[])
    );
    const currRoute = allRouters.find((route) => {
      // const currRouteWithChild = routersWithChild.find(
      //   (r) => r.path === route.path
      // );

      if (activeRoute.includes("widgets"))
        return route.path === activeRoute.split("widgets/")[1];
      return route.path === activeRoute;
    });

    return currRoute ? currRoute.name : "/";
  }, [menuItems, activeRoute]);

  useEffect(() => {
    // console.log(isOpenHeaderSelect, isNotificationPopupOpened);
    // isOpenHeaderSelect && setNotificationPopupOpened(false);
    // isNotificationPopupOpened && setIsOpenHeaderSelect(false);
  }, [isOpenHeaderSelect, isNotificationPopupOpened]);

  return (
    <DocumentTitle title={`Crypto Donutz - ${titleApp}`}>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sider
          hidden={hiddenLayoutElements}
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
          width="240"
        >
          <div className="sidebar-logo">
            <span>Crypto Donutz</span>
            <img src={DonutzLogo} alt="donut logo" />
          </div>
          <div className="sidebar-content">
            <Menu
              theme="dark"
              selectedKeys={[activeRoute]}
              defaultOpenKeys={[pathname.includes("widgets") ? "widgets" : ""]}
              mode="inline"
              onClick={({ key }) => navigate(key)}
              items={
                menuItems &&
                menuItems.map(({ name, icon, menu, path, children }) => {
                  return menu
                    ? getItem({
                        label: name,
                        path,
                        icon,
                        children:
                          children &&
                          children.map((el) =>
                            el.menu
                              ? getItem({
                                  label: el.name,
                                  path: path + (`/${el.path}` || ""),
                                  icon: el.icon,
                                })
                              : null
                          ),
                      })
                    : null;
                })
              }
            />
            <div className="sidebar-email">
              <EmailIcon />
              <a href="mailto:info@cryptodonutz.xyz">info@cryptodonutz.xyz</a>
            </div>
          </div>
        </Sider>
        <BackTop />
        <Layout
          className="site-layout"
          style={{ marginLeft: hiddenLayoutElements ? 0 : 240 }}
        >
          <Header
            className="site-layout-background"
            hidden={hiddenLayoutElements}
          >
            <div className="navbar__right-side">
              {user && user.id && (
                <>
                  <div className="notifications">
                    <div
                      className="icon icon-notifications"
                      onClick={() =>
                        setNotificationPopupOpened(!isNotificationPopupOpened)
                      }
                    >
                      <AlertIcon />
                    </div>
                    {isNotificationPopupOpened && user.id && (
                      <NotificationsPopup user={user.id} />
                    )}
                  </div>
                  <HeaderSelect
                    user={user}
                    isOpenSelect={isOpenHeaderSelect}
                    setOpenSelect={setIsOpenHeaderSelect}
                  />
                </>
              )}
            </div>
          </Header>
          <Content>
            <div
              className={clsx("main-container", {
                noPadding: noPaddingMainConteiner,
              })}
            >
              <Pages />
            </div>
          </Content>
        </Layout>
      </Layout>
    </DocumentTitle>
  );
};

export default LayoutApp;
