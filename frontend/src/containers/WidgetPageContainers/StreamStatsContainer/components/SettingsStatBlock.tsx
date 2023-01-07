import { useMemo } from "react";
import { Col, Row } from "antd";
import { SliderMarks } from "antd/lib/slider";
import { typeAligmnet } from "types";
import BaseButton from "components/BaseButton";
import ColorPicker from "components/ColorPicker";
import SliderForm from "components/SliderForm";
import { IEditStatData } from "appTypes";

const marksSlider: { [key: number]: typeAligmnet } = {
    0: "Left",
    1: "Center",
    2: "Right",
  };

const SettingsStatBlock = ({
  editStatData,
  loading,
  sendColorsData,
  setEditStatData,
}: {
  editStatData: IEditStatData;
  loading: boolean;
  sendColorsData: () => Promise<void>;
  setEditStatData: (editStatData: IEditStatData) => void;
}) => {
  const { title_color, bar_color, content_color, aligment } = editStatData;

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
      <div className="btn-block">
        <BaseButton
          formatId="profile_form_save_changes_button"
          padding="6px 35px"
          onClick={sendColorsData}
          fontSize="18px"
          disabled={loading}
          isMain
        />
      </div>
    </Col>
  );
};

export default SettingsStatBlock;
