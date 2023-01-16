import { useState } from "react";
import { Col, Row } from "antd";

import BaseButton from "components/BaseButton";
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
  loading,
  editGoalData,
  editWidgetData,
  setEditGoalData,
}: {
  loading: boolean;
  fonts: ISelectItem[];
  editGoalData: IWidgetGoalData;
  editWidgetData: () => Promise<void>;
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
      <div className="btn-block">
        <BaseButton
          formatId="profile_form_save_changes_button"
          padding="6px 35px"
          onClick={editWidgetData}
          fontSize="18px"
          disabled={loading}
          isMain
        />
      </div>
    </Col>
  );
};

export default SettingsGoalBlock;
