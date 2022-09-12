import { Col, DatePicker, Row } from "antd";
import "./styles.sass";

const { RangePicker } = DatePicker;

const DatesPicker = ({}: // color,
// setColor,
{
  // label: string;
  // color: string;
  // setColor: (color: string) => void;
}) => {
  return (
    <div className="colorPicker">
      <RangePicker format={'DD/MM/YYYY'} bordered={false} />
    </div>
  );
};

export default DatesPicker;
