import clsx from "clsx";
import { Tabs } from "antd";
import "./styles.sass";

interface Itab {
  label: React.ReactNode;
  key: string;
}

export const TabsComponent = ({
  tabs,
  activeKey,
  modificator,
  isBigTabs,
  setTabContent,
}: {
  tabs: Itab[];
  activeKey?: string;
  modificator?: string;
  isBigTabs?: boolean;
  setTabContent: (key: string) => void;
}) => (
  <div
    className={clsx("page_tabs", {
      [modificator as string]: modificator,
      isBigTabs,
    })}
  >
    <Tabs
      activeKey={activeKey}
      onChange={(key) => setTabContent(key)}
      items={tabs}
    />
  </div>
);
