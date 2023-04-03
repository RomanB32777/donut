import { useEffect, useState } from "react";
import { DatePicker } from "antd";
import { useIntl } from "react-intl";

import dayjsModule from "modules/dayjsModule";
import { antdLocales } from "consts";
import { LOCALES } from "appTypes";
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
  const intl = useIntl();
  const [pickerLocale, setPickerLocale] = useState<any>(null);

  const { locale } = intl;

  useEffect(() => {
    const settedLocale = locale as LOCALES;
    antdLocales[settedLocale]().then((importedLocale: any) => {
      setPickerLocale(importedLocale.default);
    });
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
        placeholder={[
          intl.formatMessage({ id: "dates_picker_placeholder_start" }),
          intl.formatMessage({ id: "dates_picker_placeholder_end" }),
        ]}
      />
    </div>
  );
};

export default DatesPicker;
