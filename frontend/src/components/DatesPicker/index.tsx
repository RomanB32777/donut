import { DatePicker } from "antd";
import { LOCALES } from "appTypes";
import { antdLocales } from "consts";
import dayjsModule from "modules/dayjsModule";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
// import "dayjs/locale/zh-cn";
// import localeTest from "antd/es/date-picker/locale/zh_CN";
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
  const { locale } = useIntl();
  // const { locale } = useContext(AppContext);
  const [pickerLocale, setPickerLocale] = useState<any>(null);

  useEffect(() => {
    // console.log(locale);
    // const settedLocale = locale as LOCALES;
    // antdLocales[settedLocale]().then((importedLocale: any) => {
    //   console.log(importedLocale);
    //   setPickerLocale(importedLocale);
    // });
  }, [locale]);

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
        locale={pickerLocale}
        disabledDate={(d) => !d || d.isAfter(dayjsModule())}
      />
    </div>
  );
};

export default DatesPicker;
