import { DatePicker } from "antd";
import "./styles.sass";

const { RangePicker } = DatePicker;

const DatesPicker = ({
  setValue,
  toFormat,
}:
{
  setValue: (startDate: string, endDate: string) => void;
  toFormat?: string;
}) => {
  return (
    <div className="datesPicker">
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
        disabledDate={(d) => !d || d.isAfter()}
      />
    </div>
  );
};

export default DatesPicker;
