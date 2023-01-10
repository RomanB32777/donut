import { Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "components/HeaderComponents/LogoComponent";
import WalletBlock from "components/HeaderComponents/WalletBlock";
import useWindowDimensions from "hooks/useWindowDimensions";
import { scrollToPosition } from "utils";
import { IRoute } from "routes";
import { useEffect, useState } from "react";
import clsx from "clsx";

const { Sider } = Layout;

const Sidebar = ({
  menuItems,
  activeRoute,
  hiddenLayoutElements,
  collapsed,
  setCollapsed,
  closeAllHeaderPopups,
}: {
  menuItems: IRoute[];
  activeRoute: string;
  hiddenLayoutElements: boolean;
  collapsed: boolean;
  setCollapsed: (state: boolean) => any;
  closeAllHeaderPopups: () => void;
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isMobile, isTablet } = useWindowDimensions();

  const [isVisibleContent, setIsVisibleContent] = useState(false);

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

  const menuItemSelect = (key: string) => {
    navigate(key);
    scrollToPosition();
    isTablet && setCollapsed(true);
  };

  useEffect(() => {
    if (!collapsed) {
      setIsVisibleContent(false);
      setTimeout(() => setIsVisibleContent(true), 200);
    } else {
      setIsVisibleContent(false);
    }
  }, [collapsed]);

  return (
    <>
      {!collapsed && (
        <div className="sidebar-overlay" onClick={() => setCollapsed(true)} />
      )}
      <Sider
        hidden={hiddenLayoutElements}
        width={isTablet ? 325 : 250}
        onClick={closeAllHeaderPopups}
        collapsible
        collapsed={collapsed}
        collapsedWidth="0"
        className={clsx("layout-sidebar", { isBlur: isVisibleContent })}
        trigger={null}
        
      >
        {!collapsed && <Logo navigateUrl="/" />}
        <div
          className={clsx("sidebar-content", {
            visible: isVisibleContent,
          })}
        >
          {isMobile && (
            <WalletBlock
              modificator="sidebar-wallet"
              popupModificator="wallet-popup"
            />
          )}
          <Menu
            theme="dark"
            selectedKeys={[activeRoute]}
            defaultOpenKeys={[pathname.includes("widgets") ? "widgets" : ""]}
            triggerSubMenuAction="click"
            mode="inline"
            onClick={({ key }) => menuItemSelect(key)}
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
        </div>
      </Sider>
    </>
  );
};

export default Sidebar;
