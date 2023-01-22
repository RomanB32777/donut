import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import clsx from "clsx";

import Sidebar from "components/Sidebar";
import PageTitle from "components/PageTitle";
import AdminHeader from "components/AdminComponents/AdminHeader";
import useWindowDimensions from "hooks/useWindowDimensions";
import { adminPath } from "consts";
import { themes } from "./const";
import { IHelpContent } from "./types";
import "./styles.sass";
import { getRandomStr } from "utils";

const navigateUrl = `/${adminPath}/dashboard`;
const sidebarWidth = 350;

const HelpCenterContainer = () => {
  const { theme } = useParams();
  const { isTablet } = useWindowDimensions();

  const [collapsed, setCollapsed] = useState(true);

  const renderContent = ({
    content,
    index,
    isStep,
  }: {
    content: string | IHelpContent<string | IHelpContent<string>>;
    index: number;
    isStep?: Boolean;
  }) => {
    const key = getRandomStr(5) + index;
    if (typeof content === "object") {
      const { text, image, steps } = content;
      return (
        <div
          className={clsx("content-item", {
            stepWrapper: isStep,
          })}
          key={key}
        >
          <p
            className={clsx("content-text", {
              stepItem: isStep,
            })}
            dangerouslySetInnerHTML={{ __html: text }}
          />
          {image && <img src={image} alt={text} />}
          {Boolean(steps?.length) &&
            content.steps?.map((step, index) =>
              renderContent({ content: step, index, isStep: true })
            )}
        </div>
      );
    }
    return (
      <p
        className={clsx("content-text", {
          stepItem: isStep,
        })}
        key={key}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  const itemsMenu = useMemo(
    () =>
      themes.map((theme) => ({
        ...theme,
        key: theme.label.toLowerCase(),
        children:
          theme.children?.map((subtheme) => ({
            ...subtheme,
            key: `/help/center/${subtheme.label
              .toLowerCase()
              .replace(/[.?,%]/g, "")
              .replaceAll(" ", "_")}`,
          })) || [],
      })),
    []
  );

  const activeTheme = useMemo(() => {
    const subThemes = itemsMenu.map(({ children }) => children).flat();
    return (
      subThemes.find(({ key }) => key.split("center/")[1] === theme) ||
      subThemes[0]
    );
  }, [itemsMenu, theme]);

  const defaultOpenKey = useMemo(
    () =>
      itemsMenu.find((item) =>
        item.children.some((theme) => theme.key === activeTheme.key)
      ),
    [activeTheme, itemsMenu]
  );

  useEffect(() => {
    isTablet ? setCollapsed(true) : setCollapsed(false);
  }, [isTablet]);

  return (
    <div className="helpCenter">
      <Sidebar
        items={itemsMenu}
        activeItem={activeTheme.key}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        logoNavigateUrl={navigateUrl}
        width={{ mobile: sidebarWidth, desktop: sidebarWidth }}
        defaultOpenKeys={[defaultOpenKey?.key || ""]}
        bottomEl={
          <Link to={navigateUrl} className="sidebar-btmEl">
            <span className="btmEl-link">Admin</span>
          </Link>
        }
      />
      <div className="header-wrapper">
        <AdminHeader
          collapsedSidebar={collapsed}
          setCollapsedSidebar={setCollapsed}
          headerModificator="header"
        />
      </div>
      <div
        className="helpCenter-container fadeIn"
        style={{
          paddingLeft: isTablet ? 0 : sidebarWidth,
        }}
      >
        <PageTitle title={activeTheme.label} />
        {activeTheme.content?.map((item, index) =>
          renderContent({ content: item, index })
        )}
      </div>
    </div>
  );
};

export default HelpCenterContainer;
