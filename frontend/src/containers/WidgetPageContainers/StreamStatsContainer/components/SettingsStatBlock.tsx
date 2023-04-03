import { FC, useMemo, useState } from "react";
import { Col, Row } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
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

const marksSlider: Record<number, typeAligmnet> = {
  0: "Left",
  1: "Center",
  2: "Right",
};

interface ISettingsStatBlock {
  fonts: ISelectItem[];
  children?: React.ReactNode;
  editStatData: IWidgetStatData;
  setEditStatData: (editStatData: IWidgetStatData) => void;
}

const SettingsStatBlock: FC<ISettingsStatBlock> = ({
  fonts,
  children,
  editStatData,
  setEditStatData,
}) => {
  const intl = useIntl();
  const [fontList, setFontList] = useState<ISelectItem[]>(
    fonts.slice(0, notVisibleFontsCount)
  );

  const {
    titleColor,
    barColor,
    contentColor,
    textAligment,
    titleFont,
    contentFont,
  } = editStatData;

  const onOpenFontSelect = (isOpen: boolean) => {
    isOpen
      ? setFontList(fonts)
      : setFontList(fonts.slice(0, notVisibleFontsCount));
  };

  const valueSlider = useMemo(
    () =>
      Object.keys(marksSlider).find(
        (key) => marksSlider[+key] === textAligment
      ),
    [textAligment]
  );

  return (
    <Col xl={13} md={24}>
      <Row gutter={[0, 18]} className="form">
        <Col span={24}>
          <div className="form-element">
            <ColorPicker
              name="stats_widget_settings_title"
              setColor={(color) =>
                setEditStatData({ ...editStatData, titleColor: color })
              }
              color={titleColor}
              label={<FormattedMessage id="stats_widget_settings_title" />}
              labelCol={10}
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <ColorPicker
              name="stats_widget_settings_bar_color"
              setColor={(color) =>
                setEditStatData({ ...editStatData, barColor: color })
              }
              color={barColor}
              label={<FormattedMessage id="stats_widget_settings_bar_color" />}
              labelCol={10}
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <ColorPicker
              name=""
              setColor={(color) =>
                setEditStatData({
                  ...editStatData,
                  contentColor: color,
                })
              }
              color={contentColor}
              label={
                <FormattedMessage id="stats_widget_settings_сontent_color" />
              }
              labelCol={10}
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <SelectInput
              label={<FormattedMessage id="stats_widget_settings_title_font" />}
              value={{
                value: titleFont.name,
                label: <FontStyleElement fontName={titleFont.name} />,
              }}
              list={fontList}
              modificator="form-select"
              onChange={({ value }, option) =>
                setEditStatData({
                  ...editStatData,
                  titleFont: {
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
              label={
                <FormattedMessage id="stats_widget_settings_сontent_font" />
              }
              value={{
                value: contentFont.name,
                label: <FontStyleElement fontName={contentFont.name} />,
              }}
              list={fontList}
              modificator="form-select"
              onChange={({ value }, option) =>
                setEditStatData({
                  ...editStatData,
                  contentFont: {
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
              label={
                <FormattedMessage id="stats_widget_settings_сontent_alignment" />
              }
              marks={Object.entries(marksSlider).reduce(
                (acc, [key, value]) => ({
                  ...acc,
                  [key]: intl.formatMessage({
                    id: `stats_widget_settings_сontent_alignment_${value.toLowerCase()}`,
                  }),
                }),
                {}
              )}
              modificator="aligment-slider"
              min={0}
              max={2}
              step={1}
              setValue={(value) =>
                setEditStatData({
                  ...editStatData,
                  textAligment: marksSlider[value],
                })
              }
              defaultValue={valueSlider ? +valueSlider : 1}
              tooltipVisible={false}
              maxWidth={250}
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
