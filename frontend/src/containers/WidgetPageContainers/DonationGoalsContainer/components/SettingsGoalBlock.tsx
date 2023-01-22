import { useState } from "react";
import { Col, Row } from "antd";

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
    title_color,
    progress_color,
    background_color,
    title_font,
    progress_font,
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
              setColor={(color) =>
                setEditGoalData({ ...editGoalData, title_color: color })
              }
              color={title_color}
              label="Goal title color:"
              labelCol={9}
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <ColorPicker
              setColor={(color) =>
                setEditGoalData({ ...editGoalData, progress_color: color })
              }
              color={progress_color}
              label="Progress bar color:"
              labelCol={9}
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <ColorPicker
              setColor={(color) =>
                setEditGoalData({
                  ...editGoalData,
                  background_color: color,
                })
              }
              color={background_color}
              label="Background color:"
              labelCol={9}
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <SelectInput
              label="Goal title font:"
              value={{
                value: title_font.name,
                label: <FontStyleElement fontName={title_font.name} />,
              }}
              list={fontList}
              modificator="form-select"
              onChange={({ value }, option) =>
                setEditGoalData({
                  ...editGoalData,
                  title_font: {
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
              label="Goal progress font:"
              value={{
                value: progress_font.name,
                label: <FontStyleElement fontName={progress_font.name} />,
              }}
              list={fontList}
              modificator="form-select"
              onChange={({ value }, option) =>
                setEditGoalData({
                  ...editGoalData,
                  progress_font: {
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
