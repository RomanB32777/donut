import { Col, Row, RowProps, Switch, SwitchProps, Tooltip } from "antd";
import clsx from "clsx";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";
import useWindowDimensions from "hooks/useWindowDimensions";
import "./styles.sass";

interface ISliderProps extends SwitchProps {
  // extends SliderBaseProps
  afterComponent?: React.ReactNode;
  label?: React.ReactNode;
  switchCol?: number;
  labelCol?: number;
  maxWidth?: number;
  gutter?: number | [number, number];
  rowProps?: RowProps;
  labelModificator?: string;
  isVisibleStatus?: boolean;
  tooltipTitle?: React.ReactNode;
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
  rowProps,
  labelModificator,
  isVisibleStatus,
  tooltipTitle,
  setValue,
}: ISliderProps) => {
  const { isMobile } = useWindowDimensions();

  const tooltipTrigger = useMemo(() => {
    if (!tooltipTitle) return "none";
    if (isMobile && tooltipTitle) return "click";

    return "none";
  }, [isMobile, tooltipTitle]);

  return (
    <div className="switch">
      <Row
        style={{
          width: "100%",
        }}
        align="middle"
        gutter={gutter || 0}
        {...rowProps}
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
            <span className={clsx("slider-label", labelModificator)}>
              {label}
            </span>
          </Col>
        )}
        <Col md={switchCol || (label ? 12 : 24)} xs={24}>
          <div className="switch-wrapper">
            {isVisibleStatus && (
              <span>
                <FormattedMessage id="switch_disabled" />
              </span>
            )}
            <Tooltip title={tooltipTitle} trigger={tooltipTrigger}>
              <Switch checked={checked} onChange={setValue} />
            </Tooltip>
            {isVisibleStatus && (
              <span>
                <FormattedMessage id="switch_abled" />
              </span>
            )}
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
