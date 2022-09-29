import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { BackTop, Layout, Menu, Row } from "antd";
import DocumentTitle from "react-document-title";
import clsx from "clsx";

import { IRoute, Pages, routers } from "../../routes";
import { AlertIcon, EmailIcon } from "../../icons/icons";

import useWindowDimensions from "../../hooks/useWindowDimensions";
import { getNotifications } from "../../store/types/Notifications";
import { getNotificationMessage } from "../../utils";
import Logo from "../../components/HeaderComponents/LogoComponent";
import { HeaderComponent } from "../../components/HeaderComponents/HeaderComponent";
import Loader from "../../components/Loader";
import "./styles.sass";

const { Content, Sider } = Layout;

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
  children: children || null,
  label,
});

const scrollToPosition = (top = 0) => {
  try {
    window.scroll({
      top: top,
      left: 0,
      behavior: "smooth",
    });
  } catch (_) {
    window.scrollTo(0, top);
  }
};

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
          { sum: n.donation.sum_donation, wallet: n.donation.wallet_type }
        )}
      {n.badge &&
        getNotificationMessage(
          n.badge.creator_id === user
            ? "add_badge_creator"
            : "add_badge_supporter",
          n.badge.creator_id === user
            ? n.badge.supporter_username
            : n.badge.creator_username,
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
  const { width, isTablet } = useWindowDimensions();

  const [isNotificationPopupOpened, setNotificationPopupOpened] =
    useState<boolean>(false);

  const [isOpenHeaderSelect, setIsOpenHeaderSelect] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState(true);

  const handlerHeaderSelect = (e?: React.MouseEvent<HTMLDivElement>) => {
    e && e.stopPropagation();
    setIsOpenHeaderSelect(!isOpenHeaderSelect);
    setNotificationPopupOpened(false);
  };

  const handlerNotificationPopup = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setNotificationPopupOpened(!isNotificationPopupOpened);
    setIsOpenHeaderSelect(false);
  };

  const closeAllHeaderPopups = () => {
    isOpenHeaderSelect && setIsOpenHeaderSelect(false);
    isNotificationPopupOpened && setNotificationPopupOpened(false);
  };

  useEffect(() => {
    isTablet ? setCollapsed(true) : setCollapsed(false);
  }, [width]);

  const menuItems: IRoute[] = useMemo(() => {
    const menuShowItems = routers.reduce((acc, route) => {
      route.protected
        ? user.id && addToMenu(route, acc, user)
        : addToMenu(route, acc, user);
      return acc;
    }, [] as IRoute[]);
    return menuShowItems.sort((n1, n2) => {
      if (n1.menuOrder && n2.menuOrder) {
        if (n1.menuOrder > n2.menuOrder) return 1;
        if (n1.menuOrder < n2.menuOrder) return -1;
      }
      return 0;
    });
  }, [user]);

  const activeRoute: string = useMemo(
    () =>
      pathname[0] === "/" && pathname !== "/"
        ? pathname.replace("/", "")
        : pathname,
    [pathname]
  );

  const hiddenLayoutElements: boolean = useMemo(() => {
    const pathsWithHiddenLayoutElements = routers.filter(
      (route) => route.hiddenLayoutElements
    );

    return pathsWithHiddenLayoutElements.some(
      (route) => pathname.split("/")[1] === route.path?.split("/")[0]
    );
  }, [pathname]);

  const isTransparentMainConteiner: boolean = useMemo(() => {
    const pathsWithTransparentBgLayoutElements = routers.filter(
      (route) => route.transparet
    );

    return pathsWithTransparentBgLayoutElements.some(
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

    return currRoute ? currRoute.name : "";
  }, [menuItems, activeRoute]);

  return (
    <DocumentTitle
      title={`Crypto Donutz${
        Boolean(titleApp?.length) ? ` - ${titleApp}` : ""
      }`}
    >
      <Layout
        style={{
          minHeight: "100vh",
          position: "relative",
        }}
        className={clsx({
          transparent: isTransparentMainConteiner,
        })}
      >
        {!collapsed && (
          <div className="sidebar-overlay" onClick={() => setCollapsed(true)} />
        )}
        <Sider
          hidden={hiddenLayoutElements}
          width={isTablet ? 275 : 250}
          onClick={() => closeAllHeaderPopups()}
          collapsible
          collapsed={collapsed}
          collapsedWidth="0"
          className="layout-sidebar"
          trigger={null}
          onCollapse={(c, t) => console.log(c, t)}
        >
          {!collapsed && <Logo navigateUrl="/landing" />}
          <div className="sidebar-content">
            <Menu
              theme="dark"
              selectedKeys={[activeRoute]}
              defaultOpenKeys={[pathname.includes("widgets") ? "widgets" : ""]}
              triggerSubMenuAction="click"
              mode="inline"
              onClick={({ key }) => {
                navigate(key);
                scrollToPosition();
                isTablet && setCollapsed(true);
              }}
              // getPopupContainer={(el) => {
              //   // el.style.display = "none";
              //   console.log(el);

              //   return el;
              // }}
              items={
                menuItems &&
                menuItems.map(({ name, icon, menu, path, children }) => {
                  return menu
                    ? getItem({
                        label: name,
                        path,
                        icon,
                        children: children
                          ? children.map((el) =>
                              el.menu
                                ? getItem({
                                    label: el.name,
                                    path: path + (`/${el.path}` || ""),
                                    icon: el.icon,
                                  })
                                : null
                            )
                          : null,
                      })
                    : null;
                })
              }
            />
            {!collapsed && (
              <div className="sidebar-email">
                <EmailIcon />
                <a href="mailto:info@cryptodonutz.xyz">info@cryptodonutz.xyz</a>
              </div>
            )}
          </div>
        </Sider>
        <BackTop />
        <Layout
          className="site-layout"
          style={{
            marginLeft: hiddenLayoutElements || isTablet ? 0 : 250, // collapsed
          }}
        >
          <HeaderComponent
            hidden={hiddenLayoutElements}
            onClick={() => closeAllHeaderPopups()}
            isOpenHeaderSelect={isOpenHeaderSelect}
            handlerHeaderSelect={handlerHeaderSelect}
            visibleGamburger={true}
            collapsedSidebar={collapsed}
            setCollapsedSidebar={setCollapsed}
            modificator="layout-header"
          >
            {user.id && (
              <div className="notifications">
                <div
                  className="icon icon-notifications"
                  onClick={handlerNotificationPopup}
                >
                  <AlertIcon />
                </div>
                {isNotificationPopupOpened && user.id && (
                  <NotificationsPopup user={user.id} />
                )}
              </div>
            )}
          </HeaderComponent>
          <Content
            onClick={() => closeAllHeaderPopups()}
            style={{
              background: isTransparentMainConteiner
                ? "rgba(0, 0, 0, 0)"
                : "#000000",
            }}
          >
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
