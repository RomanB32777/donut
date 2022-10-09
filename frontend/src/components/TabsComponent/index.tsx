import clsx from "clsx";
import { Tabs } from "antd";
import { typesTabContent } from "../../types";
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
  setTabContent: (key: typesTabContent) => void;
}) => (
  <div
    className={clsx("page_tabs", {
      [modificator as string]: modificator,
      isBigTabs,
    })}
  >
    <Tabs
      activeKey={activeKey}
      onChange={(key) => setTabContent(key as typesTabContent)}
      items={tabs}
    />
  </div>
);
