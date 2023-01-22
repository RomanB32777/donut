import React, { useEffect, useMemo, useState } from "react";
import AdminSidebar from "components/AdminComponents/AdminSidebar";
import AdminHeader from "components/AdminComponents/AdminHeader";

import useWindowDimensions from "hooks/useWindowDimensions";
import { useAppSelector } from "hooks/reduxHooks";

import { IRoute, routers } from "routes";
import "./styles.sass";

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

const AdminContainer = ({ children }: { children?: React.ReactNode }) => {
  const { id, roleplay } = useAppSelector(({ user }) => user);
  const { isTablet } = useWindowDimensions();
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    isTablet ? setCollapsed(true) : setCollapsed(false);
  }, [isTablet]);

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
        path,
      }))
      .sort((n1, n2) => {
        if (n1.menuOrder && n2.menuOrder) {
          if (n1.menuOrder > n2.menuOrder) return 1;
          if (n1.menuOrder < n2.menuOrder) return -1;
        }
        return 0;
      });
  }, [id, roleplay]);

  return (
    <>
      <AdminSidebar
        menuItems={menuItems}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <AdminHeader
        collapsedSidebar={collapsed}
        setCollapsedSidebar={setCollapsed}
      />
      <div
        style={{
          paddingLeft: isTablet ? 0 : 250,
        }}
      >
        {children}
      </div>
    </>
  );
};

export default AdminContainer;
