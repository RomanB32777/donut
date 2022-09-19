import { Col, DatePicker, Row } from "antd";
import "./styles.sass";

const { RangePicker } = DatePicker;

const toFormat = 'DD/MM/YYYY'

const DatesPicker = ({
  setValue,
}: // startDate,
// endDate,
{
  setValue: (startDate: string, endDate: string) => void;
  // startDate?: string;
  // endDate?: string;
}) => {
  return (
    <div className="colorPicker">
      <RangePicker
        format={toFormat}
        bordered={false}
        onChange={(val) =>
          val?.[0] && val?.[1]
            ? setValue(val?.[0]?.format(toFormat), val?.[1]?.format(toFormat))
            : setValue("", "")
        }
      />
    </div>
  );
};

export default DatesPicker;
