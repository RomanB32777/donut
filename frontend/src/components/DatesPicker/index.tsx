import { DatePicker } from "antd";
import dayjsModule from "modules/dayjsModule";
import "./styles.sass";

const { RangePicker } = DatePicker;

const DatesPicker = ({
  defaultValue,
  toFormat,
  setValue,
}: {
  defaultValue?: any;
  toFormat?: string;
  setValue: (startDate: string, endDate: string) => void;
}) => {
  return (
    <div className="datesPicker">
      <RangePicker
        defaultValue={defaultValue}
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
        disabledDate={(d) => !d || d.isAfter(dayjsModule())}
      />
    </div>
  );
};

export default DatesPicker;
