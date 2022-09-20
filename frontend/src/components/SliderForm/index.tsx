import { Col, Row, Slider } from "antd";
import { SliderBaseProps, SliderMarks } from "antd/lib/slider";
import "./styles.sass";

interface ISliderProps extends SliderBaseProps {
  label: string;
  defaultValue?: number;
  value?: number;
  InputCol?: number;
  labelCol?: number;
  maxWidth?: number;
  setValue: (value: number) => void;
}

const SliderForm = ({
  label,
  defaultValue,
  step,
  max,
  min,
  marks,
  maxWidth,
  tooltipVisible,
  InputCol,
  labelCol,
  setValue,
}: ISliderProps) => {
  return (
    <div className="slider">
      <Row
        style={{
          width: "100%",
        }}
      >
        <Col
          span={labelCol || 12}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <span className="slider-label">{label}</span>
        </Col>
        <Col span={InputCol || 12}>
          <div
            className="slider-component"
            style={{
              maxWidth,
            }}
          >
            <Slider
              defaultValue={defaultValue}
              onChange={setValue}
              marks={marks}
              step={step}
              max={max}
              min={min}
              tooltipVisible={tooltipVisible}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SliderForm;
