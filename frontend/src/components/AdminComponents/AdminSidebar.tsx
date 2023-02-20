import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { QuestionCircleOutlined } from "@ant-design/icons";

import WalletBlock from "components/HeaderComponents/WalletBlock";
import Sidebar from "components/Sidebar";
import { EmailIcon } from "icons";

import useWindowDimensions from "hooks/useWindowDimensions";
import { useAppSelector } from "hooks/reduxHooks";
import { IRoute, routers } from "routes";

interface IGetItemParams {
  label: any;
  path: any;
  icon: any;
  children?: any;
}

const AdminSidebar = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (state: boolean) => any;
}) => {
  const { id, roleplay } = useAppSelector(({ user }) => user);
  const { pathname } = useLocation();
  const { isMobile } = useWindowDimensions();

  const getItem = ({ label, path, icon, children }: IGetItemParams) => ({
    key: path,
    icon: icon || null,
    children: children || null,
    label,
  });

  const menuItems: IRoute[] = useMemo(() => {
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

  const activeRoute = useMemo(() => {
    const pathElements = pathname.split("/").reverse();
    return pathElements.includes("widgets")
      ? `widgets/${pathElements[0]}`
      : pathElements[0];
  }, [pathname]);

  return (
    <Sidebar
      items={menuItems.map(({ name, icon, menu, path, children }) => {
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
      })}
      activeItem={activeRoute}
      defaultOpenKeys={[pathname.includes("widgets") ? "widgets" : ""]}
      collapsed={collapsed}
      setCollapsed={setCollapsed}
      width={{ mobile: 325, desktop: 250 }}
      bottomEl={
        <div className="sidebar-btmEl">
          <a
            href="https://crypto-donutz.gitbook.io/"
            target="_blank"
            rel="noreferrer"
            className="sidebar-link"
          >
            <QuestionCircleOutlined />
            <span className="link-text">Help center</span>
          </a>
          <a href="mailto:info@cryptodonutz.xyz" className="sidebar-link">
            <EmailIcon />
            <span className="link-text"> info@cryptodonutz.xyz</span>
          </a>
        </div>
      }
    >
      {isMobile && (
        <WalletBlock
          modificator="sidebar-wallet"
          popupModificator="wallet-popup"
        />
      )}
    </Sidebar>
  );
};

export default AdminSidebar;
