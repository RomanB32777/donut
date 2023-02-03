import { useLocation } from "react-router-dom";
import WalletBlock from "components/HeaderComponents/WalletBlock";
import Sidebar from "components/Sidebar";
import useWindowDimensions from "hooks/useWindowDimensions";
import { IRoute } from "routes";
import { useMemo } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";

interface IGetItemParams {
  label: any;
  path: any;
  icon: any;
  children?: any;
}

const AdminSidebar = ({
  menuItems,
  collapsed,
  setCollapsed,
}: {
  menuItems: IRoute[];
  collapsed: boolean;
  setCollapsed: (state: boolean) => any;
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
