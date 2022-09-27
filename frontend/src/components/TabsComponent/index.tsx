import { Tabs } from "antd";
import { EyeOutlined, SettingOutlined } from "@ant-design/icons";
import { typesTabContent } from "../../types";
import "./styles.sass";

export const TabsComponent = ({
  setTabContent,
}: {
  setTabContent: (key: typesTabContent) => void;
}) => (
  <div className="page_tabs">
    <Tabs onChange={(key) => setTabContent(key as typesTabContent)}>
      <Tabs.TabPane
        tab={
          <>
            <SettingOutlined />
            Settings
          </>
        }
        key="settings"
      />
      <Tabs.TabPane
        tab={
          <>
            <EyeOutlined />
            Preview
          </>
        }
        key="preview"
      />
    </Tabs>
  </div>
);
