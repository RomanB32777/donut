import { Col, DatePicker, Row } from "antd";
import "./styles.sass";

const { RangePicker } = DatePicker;

const DatesPicker = ({
  setValue,
  toFormat,
}: // startDate,
// endDate,
{
  setValue: (startDate: string, endDate: string) => void;
  toFormat?: string;
  // startDate?: string;
  // endDate?: string;
}) => {
  return (
    <div className="colorPicker">
      <RangePicker
        format={toFormat || "DD/MM/YYYY"}
        bordered={false}
        onChange={(val) =>
          val?.[0] && val?.[1]
            ? setValue(
                val?.[0]?.format(toFormat || "DD/MM/YYYY"),
                val?.[1]?.format(toFormat || "DD/MM/YYYY")
              )
            : setValue("", "")
        }
      />
    </div>
  );
};

export default DatesPicker;
