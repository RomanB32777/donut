import { Col, Row, Switch, SwitchProps } from "antd";
import clsx from "clsx";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import "./styles.sass";

interface ISliderProps extends SwitchProps {
  // extends SliderBaseProps
  afterComponent?: React.ReactNode;
  label?: string;
  switchCol?: number;
  labelCol?: number;
  maxWidth?: number;
  gutter?: number | [number, number];
  labelModificator?: string;
  isVisibleStatus?: boolean;
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
  labelModificator,
  isVisibleStatus,
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
        // justify={justify || "start"}
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
          <span
            className={clsx("slider-label", {
              [labelModificator as string]: labelModificator,
            })}
          >
            {label}
          </span>
        </Col>
        <Col md={switchCol || (label ? 12 : 24)} xs={24}>
          <div className="switch-wrapper">
            {isVisibleStatus && <span>Disabled</span>}
            <Switch checked={checked} onChange={setValue} />
            {isVisibleStatus && <span>Abled</span>}
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
