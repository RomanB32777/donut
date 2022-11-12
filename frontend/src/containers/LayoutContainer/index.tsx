import React, { useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { BackTop, Layout, Menu } from "antd";
import DocumentTitle from "react-document-title";
import clsx from "clsx";

import { IRoute, Pages, routers } from "../../routes";
import { AlertIcon, EmailIcon } from "../../icons/icons";

import { WebSocketContext } from "../../components/Websocket";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import Logo from "../../components/HeaderComponents/LogoComponent";
import { HeaderComponent } from "../../components/HeaderComponents/HeaderComponent";
import NotificationsPopup from "../../components/HeaderComponents/NotificationsPopup";
import { getBadgesStatus } from "../../utils";
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
  const socket = useContext(WebSocketContext);
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

  useEffect(() => {
    user.id && socket && getBadgesStatus(user, socket);
  }, [user, socket]);

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

    const childRouters = routersWithChild.filter((route) => route.children);

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
          {!collapsed && <Logo navigateUrl="/" />}
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
          className={clsx("site-layout", {
            transparent: isTransparentMainConteiner,
          })}
          style={{
            marginLeft: hiddenLayoutElements || isTablet ? 0 : 250, // collapsed
          }}
        >
          <HeaderComponent
            hidden={hiddenLayoutElements}
            onClick={() => closeAllHeaderPopups()}
            isOpenHeaderSelect={isOpenHeaderSelect}
            handlerHeaderSelect={handlerHeaderSelect}
            collapsedSidebar={collapsed}
            setCollapsedSidebar={setCollapsed}
            modificator="layout-header"
            visibleGamburger
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
                noMargin: hiddenLayoutElements,
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
