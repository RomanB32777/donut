import { Col, Row, Switch, SwitchProps } from "antd";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import "./styles.sass";

interface ISliderProps extends SwitchProps {
  // extends SliderBaseProps
  label: string;
  afterComponent?: React.ReactNode;
  switchCol?: number;
  labelCol?: number;
  maxWidth?: number;
  gutter?: number | [number, number];
  setValue: (value: boolean) => void;
}

const SwitchForm = ({
  label,
  checked,
  afterComponent,
  maxWidth,
  switchCol,
  labelCol,
  gutter,
  setValue,
}: ISliderProps) => {
  const { isMobile } = useWindowDimensions();

  return (
    <div className="switch">
      <Row
        style={{
          width: "100%",
        }}
        align="middle"
        gutter={gutter || 0}
      >
        <Col
          md={labelCol || (label ? 12 : 0)}
          xs={24}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <span className="slider-label">{label}</span>
        </Col>
        <Col md={switchCol || (label ? 12 : 24)} xs={24}>
          <div className="switch-wrapper">
            <span>Disabled</span>
            <Switch checked={checked} onChange={setValue} id="voiceSwitch" />
            <span>Abled</span>
          </div>
        </Col>
      </Row>
      {afterComponent && (
        <Row>
          <Col
            offset={(!isMobile ? labelCol : 0) || (label && !isMobile ? 12 : 0)}
            md={switchCol || (label ? 12 : 24)}
          >
            <div
              style={{
                maxWidth,
              }}
              className="switch-after"
            >
              {afterComponent}
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default SwitchForm;
