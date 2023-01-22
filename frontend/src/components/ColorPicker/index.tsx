import { Col, Row } from "antd";
import { getRandomStr } from "utils";
import "./styles.sass";

const ColorPicker = ({
  label,
  color,
  inputCol,
  labelCol,
  gutter,
  setColor,
}: {
  label: string;
  color: string;
  inputCol?: number;
  labelCol?: number;
  gutter?: number | [number, number];
  setColor: (color: string) => void;
}) => {
  const idForInput = `color_${label.split(" ").join("_") + getRandomStr(4)}`;
  return (
    <div className="colorPicker">
      <Row
        style={{
          width: "100%",
        }}
        gutter={gutter || 0}
      >
        <Col
          md={labelCol || 12}
          xs={24}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <span className="colorPicker-label">{label}</span>
        </Col>
        <Col md={inputCol || 12} xs={24}>
          <label htmlFor={idForInput} className="colorPicker-inputWrapper">
            <span>{color}</span>
            <input
              type="color"
              value={color}
              id={idForInput}
              onChange={(e) => setColor(e.target.value)}
            />
          </label>
        </Col>
      </Row>
    </div>
  );
};

export default ColorPicker;
