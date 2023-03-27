import { Col, Row, Slider } from "antd";
import { SliderBaseProps } from "antd/lib/slider"; // SliderMarks
import clsx from "clsx";
import useWindowDimensions from "hooks/useWindowDimensions";
import "./styles.sass";

interface ISliderProps extends SliderBaseProps {
  label: React.ReactNode;
  value?: number;
  defaultValue?: number;
  modificator?: string;
  description?: React.ReactNode;
  sliderCol?: number;
  labelCol?: number;
  maxWidth?: number;
  tooltipVisible?: boolean;
  gutter?: number | [number, number];
  setValue: (value: number) => void;
}

const SliderForm = ({
  step,
  max,
  min,
  marks,
  label,
  value,
  gutter,
  maxWidth,
  labelCol,
  sliderCol,
  modificator,
  description,
  defaultValue,
  tooltipVisible,
  setValue,
}: ISliderProps) => {
  const { isMobile } = useWindowDimensions();

  return (
    <div className={clsx("slider", modificator)}>
      <Row
        style={{
          width: "100%",
        }}
        gutter={gutter || 0}
      >
        {label && (
          <Col
            md={labelCol || 12}
            xs={24}
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <span className="slider-label">{label}</span>
          </Col>
        )}
        <Col md={sliderCol || (label ? 12 : 24)} xs={24}>
          <div
            className="slider-component"
            style={{
              maxWidth,
            }}
          >
            <Slider
              value={value}
              defaultValue={defaultValue}
              onChange={setValue}
              marks={marks}
              step={step}
              max={max}
              min={min}
              tooltip={{ formatter: tooltipVisible ? (value) => value : null }}
            />
          </div>
        </Col>
      </Row>
      {description && (
        <Row>
          <Col
            offset={(!isMobile ? labelCol : 0) || (label && !isMobile ? 12 : 0)}
            md={sliderCol || (label ? 12 : 24)}
          >
            <p
              style={{
                maxWidth,
              }}
              className="slider-description"
            >
              {description}
            </p>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default SliderForm;
