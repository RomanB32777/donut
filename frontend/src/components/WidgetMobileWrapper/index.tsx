import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Row } from "antd";
import { FormattedMessage } from "react-intl";
import { EyeOutlined, SettingOutlined } from "@ant-design/icons";

import TabsComponent from "components/TabsComponent";
import useWindowDimensions from "hooks/useWindowDimensions";
import { typesTabContent } from "appTypes";

interface IWidgetMobileWrapper {
  previewBlock: React.ReactNode;
  settingsBlock: React.ReactNode;
}

interface ITabsContent {
  type: typesTabContent;
  content: React.ReactNode;
}

const tabs = [
  {
    key: "Settings",
    label: (
      <>
        <SettingOutlined />
        <FormattedMessage id="widget_tab_settings" />
      </>
    ),
  },
  {
    key: "Preview",
    label: (
      <>
        <EyeOutlined />
        <FormattedMessage id="widget_tab_preview" />
      </>
    ),
  },
];

const WidgetMobileWrapper: FC<IWidgetMobileWrapper> = ({
  previewBlock,
  settingsBlock,
}) => {
  const { isLaptop } = useWindowDimensions();
  const [tabContent, setTabContent] = useState<typesTabContent | null>(null);

  const tabsHandler = useCallback(
    (key: string) => setTabContent(key as typesTabContent),
    []
  );

  const contents: ITabsContent[] = useMemo(
    () => [
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
    ],
    [previewBlock, settingsBlock]
  );

  useEffect(() => {
    isLaptop ? setTabContent("Settings") : setTabContent("All");
  }, [isLaptop]);

  return (
    <div className="tabs-wrapper">
      {tabContent !== "All" && (
        <TabsComponent
          modificator="fadeIn"
          setTabContent={tabsHandler}
          tabs={tabs}
          isBigTabs
        />
      )}
      <div className="blocks fadeIn">
        {contents.map((block) => block.type === tabContent && block.content)}
      </div>
    </div>
  );
};

export default WidgetMobileWrapper;
