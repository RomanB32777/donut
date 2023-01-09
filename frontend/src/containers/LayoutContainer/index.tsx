import React, { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { BackTop, Layout } from "antd";
import DocumentTitle from "react-document-title";
import clsx from "clsx";

import { IRoute, Pages, routers } from "routes";
import { WebSocketContext } from "components/Websocket";
import useWindowDimensions from "hooks/useWindowDimensions";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import { getNotifications } from "store/types/Notifications";
import { getBadgesStatus } from "utils";
import { adminPath } from "consts";
import { useAppSelector } from "hooks/reduxHooks";
import "./styles.sass";

const { Content } = Layout;

const transparentClass = "transparent";

const addToMenu = (
  route: IRoute,
  menuArr: IRoute[],
  roleplay: any,
  iter: number = 0
) => {
  const add = () => {
    if (route.children) {
      iter++;
      route.children.forEach((chRoute) => {
        chRoute.menu && iter !== 3 && menuArr.push(chRoute);
        addToMenu(chRoute, menuArr, roleplay, iter);
      });
    }
  };
  route.roleRequired ? route.roleRequired === roleplay && add() : add();
};

const LayoutApp = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id, username, roleplay } = useAppSelector(({ user }) => user);
  const socket = useContext(WebSocketContext);
  const { width, isTablet } = useWindowDimensions();

  const [isNotificationPopupOpened, setNotificationPopupOpened] =
    useState<boolean>(false);

  const [isOpenHeaderSelect, setIsOpenHeaderSelect] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState(true);

  const closeAllHeaderPopups = () => {
    isOpenHeaderSelect && setIsOpenHeaderSelect(false);
    isNotificationPopupOpened && setNotificationPopupOpened(false);
  };

  useEffect(() => {
    isTablet ? setCollapsed(true) : setCollapsed(false);
  }, [width]);

  useEffect(() => {
    if (id) {
      socket && getBadgesStatus({ username, id }, socket);
      dispatch(getNotifications({ user: username }));
    }
  }, [id, socket]);

  const menuItems: IRoute[] = useMemo(() => {
    const menuShowItems = routers.reduce((acc, route) => {
      route.protected
        ? id && addToMenu(route, acc, roleplay)
        : addToMenu(route, acc, roleplay);
      return acc;
    }, [] as IRoute[]);

    return menuShowItems
      .map(({ path, ...i }) => ({
        ...i,
        path: path ? `${adminPath}/${path}` : adminPath,
      }))
      .sort((n1, n2) => {
        if (n1.menuOrder && n2.menuOrder) {
          if (n1.menuOrder > n2.menuOrder) return 1;
          if (n1.menuOrder < n2.menuOrder) return -1;
        }
        return 0;
      });
  }, [id, roleplay]);

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

    const isTransparent = pathsWithTransparentBgLayoutElements.some(
      (route) => pathname.split("/")[1] === route.path?.split("/")[0]
    );

    const bodyClasses = document.querySelector("body")?.classList;

    if (bodyClasses)
      isTransparent
        ? bodyClasses.add(transparentClass)
        : bodyClasses?.remove(transparentClass);

    return isTransparent;
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
        className={clsx("layout-container", {
          [transparentClass]: isTransparentMainConteiner,
        })}
      >
        <Sidebar
          menuItems={menuItems}
          collapsed={collapsed}
          activeRoute={activeRoute}
          hiddenLayoutElements={hiddenLayoutElements}
          setCollapsed={setCollapsed}
          closeAllHeaderPopups={closeAllHeaderPopups}
        />
        <BackTop />
        <Layout
          className={clsx("site-layout", {
            [transparentClass]: isTransparentMainConteiner,
          })}
          style={{
            paddingLeft: hiddenLayoutElements || isTablet ? 0 : 250, // collapsed
          }}
        >
          <Header
            collapsedSidebar={collapsed}
            isOpenHeaderSelect={isOpenHeaderSelect}
            hiddenLayoutElements={hiddenLayoutElements}
            isNotificationPopupOpened={isNotificationPopupOpened}
            setCollapsedSidebar={setCollapsed}
            closeAllHeaderPopups={closeAllHeaderPopups}
            setIsOpenHeaderSelect={setIsOpenHeaderSelect}
            setNotificationPopupOpened={setNotificationPopupOpened}
          />
          <Content
            onClick={() => closeAllHeaderPopups()}
            className={clsx("content-container", {
              [transparentClass]: isTransparentMainConteiner,
            })}
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
