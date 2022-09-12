import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { BackTop, Layout, Menu } from "antd";
import clsx from "clsx";

import { IRoute, Pages, routers } from "../../routes";
import DonutzLogo from "../../assets/DonutzLogo.png";
import { AlertIcon, SmallToggleListArrowIcon } from "../../icons/icons";
import { url } from "../../consts";

import { getNotifications } from "../../store/types/Notifications";
import { getNotificationMessage } from "../../utils";
import "./styles.sass";

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

const HeaderSelect = ({ user }: { user: any }) => {
  const [isOpenSelect, setOpenSelect] = useState(false);
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

  const activeMenuItem: string = useMemo(
    () =>
      pathname[0] === "/" && pathname !== "/"
        ? pathname.replace("/", "")
        : pathname,
    [pathname]
  );

  const [isNotificationPopupOpened, setNotificationPopupOpened] =
    useState<boolean>(false);

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
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
        <div className="logo">
          <span>Crypto Donutz</span>
          <img src={DonutzLogo} alt="donut logo" />
        </div>
        <Menu
          theme="dark"
          selectedKeys={[activeMenuItem]}
          // defaultSelectedKeys={[activeMenuItem]}
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
      </Sider>
      <BackTop />
      <Layout className="site-layout" style={{ marginLeft: 240 }}>
        <Header className="site-layout-background">
          <div className="navbar__right-side">
            {user && user.id && (
              <>
                <div
                  className="icon icon-notifications"
                  onClick={() => setNotificationPopupOpened(true)}
                >
                  <AlertIcon />
                </div>
                {isNotificationPopupOpened && user.id && (
                  <NotificationsPopup user={user.id} />
                )}
                <HeaderSelect user={user} />
              </>
            )}
          </div>
        </Header>
        <Content>
          <div className="main-container">
            <Pages />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutApp;
