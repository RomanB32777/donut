import { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { ItemType } from "antd/es/menu/hooks/useItems";

import Logo from "components/HeaderComponents/LogoComponent";
import useWindowDimensions from "hooks/useWindowDimensions";
import { scrollToPosition } from "utils";

const { Sider } = Layout;

const Sidebar = ({
  items,
  activeItem,
  hidden,
  width,
  collapsed,
  children,
  bottomEl,
  styles,
  defaultOpenKeys,
  logoNavigateUrl = "/",
  setCollapsed,
}: {
  items: ItemType[];
  activeItem: string;
  hidden?: boolean;
  collapsed: boolean;
  width: { mobile: number; desktop: number };
  defaultOpenKeys?: string[];
  logoNavigateUrl?: string;
  children?: React.ReactNode;
  bottomEl?: React.ReactNode;
  styles?: React.CSSProperties;
  setCollapsed: (state: boolean) => any;
}) => {
  const navigate = useNavigate();
  const { isTablet } = useWindowDimensions();
  const [isVisibleContent, setIsVisibleContent] = useState(false);

  const { mobile, desktop } = width;

  const collapseHandler =
    (state: boolean = true) =>
    () =>
      setCollapsed(state);

  const menuItemSelect = (key: string) => {
    navigate(key);
    scrollToPosition();
    isTablet && setCollapsed(true);
  };

  useEffect(() => {
    if (!collapsed) {
      setIsVisibleContent(false);
      setTimeout(() => setIsVisibleContent(true), 200);
    } else setIsVisibleContent(false);
  }, [collapsed]);

  return (
    <>
      {!collapsed && (
        <div className="sidebar-overlay" onClick={collapseHandler()} />
      )}
      <Sider
        collapsible
        hidden={hidden}
        width={isTablet ? mobile : desktop}
        collapsed={collapsed}
        collapsedWidth="0"
        className={clsx("layout-sidebar", { isBlur: isVisibleContent })}
        style={styles}
        trigger={null}
      >
        {!collapsed && <Logo navigateUrl={logoNavigateUrl} />}
        <div
          className={clsx("sidebar-content", {
            visible: isVisibleContent,
          })}
        >
          <div>
            {children}
            <Menu
              theme="dark"
              selectedKeys={[activeItem]}
              defaultOpenKeys={defaultOpenKeys}
              triggerSubMenuAction="click"
              mode="inline"
              className="sidebar-menu"
              onClick={({ key }) => menuItemSelect(key)}
              items={items}
            />
          </div>
          {bottomEl}
        </div>
      </Sider>
    </>
  );
};

export default Sidebar;
