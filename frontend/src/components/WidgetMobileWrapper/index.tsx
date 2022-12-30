import { useCallback, useEffect, useState } from "react";
import { Row } from "antd";
import { EyeOutlined, SettingOutlined } from "@ant-design/icons";
import { TabsComponent } from "../TabsComponent";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { typesTabContent } from "../../types";

const WidgetMobileWrapper = ({
  previewBlock,
  settingsBlock,
}: {
  previewBlock: React.ReactNode;
  settingsBlock: React.ReactNode;
}) => {
  const { isLaptop } = useWindowDimensions();
  const [tabContent, setTabContent] = useState<typesTabContent | null>(null);

  const contents: { type: typesTabContent; content: React.ReactNode }[] = [
    {
      type: "Preview",
      content: <div key="preview">{previewBlock}</div>,
    },
    {
      type: "Settings",
      content: <div key="settings">{settingsBlock}</div>,
    },
    {
      type: "All",
      content: (
        <Row
          key="all"
          gutter={[4, 4]}
          className="tabs-container"
          justify="space-between"
        >
          {previewBlock}
          {settingsBlock}
        </Row>
      ),
    },
  ];

  const memoizedCallback = useCallback(() => {
    isLaptop ? setTabContent("Settings") : setTabContent("All");
  }, [isLaptop]);

  useEffect(memoizedCallback, [memoizedCallback]);

  return (
    <div className="tabs-wrapper">
      {tabContent !== "All" && (
        <TabsComponent
          setTabContent={(key) => setTabContent(key as typesTabContent)}
          tabs={[
            {
              key: "Settings",
              label: (
                <>
                  <SettingOutlined />
                  Settings
                </>
              ),
            },
            {
              key: "Preview",
              label: (
                <>
                  <EyeOutlined />
                  Preview
                </>
              ),
            },
          ]}
          isBigTabs
        />
      )}
      {contents.map((block) => block.type === tabContent && block.content)}
    </div>
  );
};

export default WidgetMobileWrapper;
