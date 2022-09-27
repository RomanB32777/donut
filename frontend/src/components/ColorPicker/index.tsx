import { Col, Row } from "antd";
import "./styles.sass";

const ColorPicker = ({
  label,
  color,
  InputCol,
  labelCol,
  gutter,
  setColor,
}: {
  label: string;
  color: string;
  InputCol?: number;
  labelCol?: number;
  gutter?: number | [number, number];
  setColor: (color: string) => void;
}) => {
  const idForInput = `color_${label.split(" ").join("_")}`;
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
        <Col md={InputCol || 12} xs={24}>
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
