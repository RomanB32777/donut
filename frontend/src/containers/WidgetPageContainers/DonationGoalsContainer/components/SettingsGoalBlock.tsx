import { useState } from "react";
import { Col, Row } from "antd";
import { FormattedMessage } from "react-intl";

import ColorPicker from "components/ColorPicker";
import SelectInput, { ISelectItem } from "components/SelectInput";
import {
  FontSelectOption,
  FontStyleElement,
} from "components/SelectInput/options/FontSelectOption";
import { notVisibleFontsCount } from "consts";
import { IWidgetGoalData } from "appTypes";

const SettingsGoalBlock = ({
  fonts,
  children,
  editGoalData,
  setEditGoalData,
}: {
  fonts: ISelectItem[];
  children?: React.ReactNode;
  editGoalData: IWidgetGoalData;
  setEditGoalData: (editGoalData: IWidgetGoalData) => void;
}) => {
  const [fontList, setFontList] = useState<ISelectItem[]>(
    fonts.slice(0, notVisibleFontsCount)
  );

  const {
    titleColor,
    progressColor,
    backgroundColor,
    titleFont,
    progressFont,
  } = editGoalData;

  const onOpenFontSelect = (isOpen: boolean) =>
    isOpen
      ? setFontList(fonts)
      : setFontList(fonts.slice(0, notVisibleFontsCount));

  return (
    <Col xl={13} md={24}>
      <Row gutter={[0, 18]} className="form">
        <Col span={24}>
          <div className="form-element">
            <ColorPicker
              name="goals_widget_settings_title"
              setColor={(color) =>
                setEditGoalData({ ...editGoalData, titleColor: color })
              }
              color={titleColor}
              label={<FormattedMessage id="goals_widget_settings_title" />}
              labelCol={9}
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <ColorPicker
              name="goals_widget_settings_bar_color"
              setColor={(color) =>
                setEditGoalData({ ...editGoalData, progressColor: color })
              }
              color={progressColor}
              label={<FormattedMessage id="goals_widget_settings_bar_color" />}
              labelCol={9}
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <ColorPicker
              name="goals_widget_settings_background_color"
              setColor={(color) =>
                setEditGoalData({
                  ...editGoalData,
                  backgroundColor: color,
                })
              }
              color={backgroundColor}
              label={
                <FormattedMessage id="goals_widget_settings_background_color" />
              }
              labelCol={9}
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <SelectInput
              label={<FormattedMessage id="goals_widget_settings_title_font" />}
              value={{
                value: titleFont.name,
                label: <FontStyleElement fontName={titleFont.name} />,
              }}
              list={fontList}
              modificator="form-select"
              onChange={({ value }, option) =>
                setEditGoalData({
                  ...editGoalData,
                  titleFont: {
                    name: !Array.isArray(option) && option.title,
                    link: value,
                  },
                })
              }
              onDropdownVisibleChange={onOpenFontSelect}
              renderOption={FontSelectOption}
              labelCol={9}
              gutter={[0, 18]}
              labelInValue
              showSearch
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <SelectInput
              label={
                <FormattedMessage id="goals_widget_settings_progress_font" />
              }
              value={{
                value: progressFont.name,
                label: <FontStyleElement fontName={progressFont.name} />,
              }}
              list={fontList}
              modificator="form-select"
              onChange={({ value }, option) =>
                setEditGoalData({
                  ...editGoalData,
                  progressFont: {
                    name: !Array.isArray(option) && option.title,
                    link: value,
                  },
                })
              }
              onDropdownVisibleChange={onOpenFontSelect}
              renderOption={FontSelectOption}
              labelCol={9}
              gutter={[0, 18]}
              labelInValue
              showSearch
            />
          </div>
        </Col>
      </Row>
      {children}
    </Col>
  );
};

export default SettingsGoalBlock;
