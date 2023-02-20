import { FC, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { QuestionCircleOutlined } from "@ant-design/icons";

import WalletBlock from "components/HeaderComponents/WalletBlock";
import Sidebar from "components/Sidebar";

import useWindowDimensions from "hooks/useWindowDimensions";
import { IRoute } from "routes";

interface IAdminSidebar {
  menuItems: IRoute[];
  collapsed: boolean;
  setCollapsed: (state: boolean) => any;
}

interface IGetItemParams {
  label: any;
  path: any;
  icon: any;
  children?: any;
}

const AdminSidebar: FC<IAdminSidebar> = ({
  menuItems,
  collapsed,
  setCollapsed,
}) => {
  const { pathname } = useLocation();
  const { isMobile } = useWindowDimensions();

  const getItem = ({ label, path, icon, children }: IGetItemParams) => ({
    key: path,
    icon: icon || null,
    children: children || null,
    label,
  });

  const activeRoute = useMemo(() => {
    const pathElements = pathname.split("/").reverse();
    return pathElements.includes("widgets")
      ? `widgets/${pathElements[0]}`
      : pathElements[0];
  }, [pathname]);

  const menuSidebarItems = useMemo(
    () =>
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
      }),
    [menuItems]
  );

  return (
    <Sidebar
      items={menuSidebarItems}
      activeItem={activeRoute}
      defaultOpenKeys={[pathname.includes("widgets") ? "widgets" : ""]}
      collapsed={collapsed}
      setCollapsed={setCollapsed}
      width={{ mobile: 325, desktop: 250 }}
      bottomEl={
        <a
          href="https://crypto-donutz.gitbook.io/"
          target="_blank"
          rel="noreferrer"
          className="sidebar-btmEl"
        >
          <QuestionCircleOutlined />
          <span className="btmEl-link">Help center</span>
        </a>
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
