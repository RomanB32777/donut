import { FC, memo, useCallback } from "react";
import clsx from "clsx";
import { Tabs } from "antd";
import "./styles.sass";

interface ITab {
  label: React.ReactNode;
  key: string;
}

interface ITabsComponent {
  tabs: ITab[];
  activeKey?: string;
  modificator?: string;
  isBigTabs?: boolean;
  setTabContent: (key: string) => void;
}

const TabsComponent: FC<ITabsComponent> = ({
  tabs,
  activeKey,
  modificator,
  isBigTabs,
  setTabContent,
}) => {
  const tabsHandler = useCallback(
    (key: string) => setTabContent(key),
    [setTabContent]
  );

  return (
    <div
      className={clsx("page_tabs", {
        [modificator as string]: modificator,
        isBigTabs,
      })}
    >
      <Tabs activeKey={activeKey} onChange={tabsHandler} items={tabs} />
    </div>
  );
};

export default memo(TabsComponent);
