import { memo, useCallback } from "react";
import clsx from "clsx";
import { Tabs } from "antd";
import "./styles.sass";

interface ITab {
  label: React.ReactNode;
  key: string;
}

interface ITabsComponent<T> {
  tabs: ITab[];
  activeKey?: string;
  modificator?: string;
  isBigTabs?: boolean;
  setTabContent: (key: T) => void;
}

const TabsComponent = <T extends string>({
  tabs,
  activeKey,
  modificator,
  isBigTabs,
  setTabContent,
}: ITabsComponent<T>) => {
  const tabsHandler = useCallback(
    <T extends string>(key: T) => setTabContent(key as any),
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
