import { Col, Row } from "antd";
import "./styles.sass";

const ColorPicker = ({
  label,
  color,
  setColor,
  InputCol,
  labelCol,
}: {
  label: string;
  color: string;
  InputCol?: number;
  labelCol?: number;
  setColor: (color: string) => void;
}) => {
  const idForInput = `color_${label.split(" ").join("_")}`;
  return (
    <div className="colorPicker">
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
          <span className="colorPicker-label">{label}</span>
        </Col>
        <Col span={InputCol || 12}>
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
