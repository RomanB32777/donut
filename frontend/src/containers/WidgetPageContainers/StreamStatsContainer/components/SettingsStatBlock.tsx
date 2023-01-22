import { useMemo, useState } from "react";
import { Col, Row } from "antd";
import { SliderMarks } from "antd/lib/slider";
import { typeAligmnet } from "types";

import ColorPicker from "components/ColorPicker";
import SliderForm from "components/SliderForm";
import SelectInput, { ISelectItem } from "components/SelectInput";
import {
  FontSelectOption,
  FontStyleElement,
} from "components/SelectInput/options/FontSelectOption";

import { notVisibleFontsCount } from "consts";
import { IWidgetStatData } from "appTypes";

const marksSlider: { [key: number]: typeAligmnet } = {
  0: "Left",
  1: "Center",
  2: "Right",
};

const SettingsStatBlock = ({
  fonts,
  children,
  editStatData,
  setEditStatData,
}: {
  fonts: ISelectItem[];
  children?: React.ReactNode;
  editStatData: IWidgetStatData;
  setEditStatData: (editStatData: IWidgetStatData) => void;
}) => {
  const [fontList, setFontList] = useState<ISelectItem[]>(
    fonts.slice(0, notVisibleFontsCount)
  );

  const {
    title_color,
    bar_color,
    content_color,
    aligment,
    title_font,
    content_font,
  } = editStatData;

  const onOpenFontSelect = (isOpen: boolean) =>
    isOpen
      ? setFontList(fonts)
      : setFontList(fonts.slice(0, notVisibleFontsCount));

  const valueSlider = useMemo(
    () =>
      Object.keys(marksSlider).find((key) => marksSlider[+key] === aligment),
    [aligment]
  );

  return (
    <Col xl={13} md={24}>
      <Row gutter={[0, 18]} className="form">
        <Col span={24}>
          <div className="form-element">
            <ColorPicker
              setColor={(color) =>
                setEditStatData({ ...editStatData, title_color: color })
              }
              color={title_color}
              label="Goal title color:"
              labelCol={10}
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <ColorPicker
              setColor={(color) =>
                setEditStatData({ ...editStatData, bar_color: color })
              }
              color={bar_color}
              label="Goal bar color:"
              labelCol={10}
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <ColorPicker
              setColor={(color) =>
                setEditStatData({
                  ...editStatData,
                  content_color: color,
                })
              }
              color={content_color}
              label="Content color:"
              labelCol={10}
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
                setEditStatData({
                  ...editStatData,
                  title_font: {
                    name: !Array.isArray(option) && option.title,
                    link: value,
                  },
                })
              }
              onDropdownVisibleChange={onOpenFontSelect}
              renderOption={FontSelectOption}
              labelCol={10}
              gutter={[0, 18]}
              labelInValue
              showSearch
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <SelectInput
              label="Content font:"
              value={{
                value: content_font.name,
                label: <FontStyleElement fontName={content_font.name} />,
              }}
              list={fontList}
              modificator="form-select"
              onChange={({ value }, option) =>
                setEditStatData({
                  ...editStatData,
                  content_font: {
                    name: !Array.isArray(option) && option.title,
                    link: value,
                  },
                })
              }
              onDropdownVisibleChange={onOpenFontSelect}
              renderOption={FontSelectOption}
              labelCol={10}
              gutter={[0, 18]}
              labelInValue
              showSearch
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <SliderForm
              label="Content alignment:"
              marks={marksSlider as SliderMarks}
              step={1}
              min={0}
              max={2}
              setValue={(value) =>
                setEditStatData({
                  ...editStatData,
                  aligment: marksSlider[value],
                })
              }
              defaultValue={valueSlider ? +valueSlider : 1}
              maxWidth={250}
              tooltipVisible={false}
              labelCol={10}
              gutter={[0, 18]}
            />
          </div>
        </Col>
      </Row>
      {children}
    </Col>
  );
};

export default SettingsStatBlock;
