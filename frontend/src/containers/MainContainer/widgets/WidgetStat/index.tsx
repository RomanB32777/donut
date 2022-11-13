import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import type { ChartData } from "chart.js";
import { Skeleton } from "antd";
import SelectComponent from "../../../../components/SelectComponent";
import {
  currBlockchain,
  getTimePeriodQuery,
  DateFormatter,
} from "../../../../utils";
import { filterPeriodItems } from "../../../../utils/dateMethods/consts";
import axiosClient from "../../../../axiosClient";
import {
  dateFormat,
  enumerateBetweenDates,
  options,
  subtractDate,
} from "./graphData";
import {
  periodItemsTypes,
  stringFormatTypes,
} from "../../../../utils/dateMethods/types";
import { widgetApiUrl } from "../../../../consts";
import "./styles.sass";
import moment from "moment";

Chart.register(...registerables);

const WidgetStat = ({ usdtKoef }: { usdtKoef: number }) => {
  const user: any = useSelector((state: any) => state.user);
  const notifications = useSelector((state: any) => state.notifications);

  const [loading, setLoading] = useState<boolean>(true);
  const [dataChart, setDataChart] = useState<ChartData<"line">>({
    labels: [],
    datasets: [
      {
        label: "Donation sum",
        data: [],
        fill: true,
        pointBackgroundColor: "rgba(29, 20, 255, 1)",
        backgroundColor: "rgba(29, 20, 255, 0.2)",
        borderColor: "rgba(29, 20, 255, 0.5)",
      },
    ],
  });

  const [activeFilterItem, setActiveFilterItem] = useState(
    filterPeriodItems["7days"]
  );
  const getLatestDonations = async (timePeriod: periodItemsTypes) => {
    try {
      setLoading(true);
      const blockchain = currBlockchain?.nativeCurrency.symbol;
      const { data } = await axiosClient.get(
        `${widgetApiUrl}/stats/${user.id}?timePeriod=${timePeriod}&blockchain=${blockchain}`
      );
      if (data) {
        const filteredDates = {
          start: moment()
            .subtract(...subtractDate[timePeriod].split("_"))
            .startOf("day")
            .valueOf(),
          end: moment().endOf("day").valueOf(),
        };

        const initGroupDates = enumerateBetweenDates({
          startDate: filteredDates.start,
          endDate: filteredDates.end,
          timePeriod: timePeriod,
        }).reduce((acc, i) => ({ ...acc, [i]: 0 }), {});

        const groupDonats = data.reduce((acc: any, d: any) => {
          const date = DateFormatter(d.date_group, dateFormat[timePeriod]);
          return {
            ...acc,
            [date]: +(+d.sum_donation * usdtKoef).toFixed(2),
          };
        }, initGroupDates as { [key: string]: number });

        const labels = Object.keys(groupDonats).map((date: string) => date);
        const values = Object.values(groupDonats).map((sum: any) => sum);

        setDataChart({
          ...dataChart,
          labels,
          datasets: [
            {
              ...dataChart.datasets[0],
              data: values,
            },
          ],
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timePeriod = getTimePeriodQuery(activeFilterItem);
    user.id && timePeriod && usdtKoef && getLatestDonations(timePeriod);
  }, [user, activeFilterItem, usdtKoef, notifications]);

  return (
    <div className="widget widget-stat">
      {loading ? (
        <div className="widget_loading">
          <Skeleton active paragraph={{ rows: 7 }} />
        </div>
      ) : (
        <>
          <div className="widget_header">
            <span className="widget_header__title">Stats</span>
            <div className="widget_header__filter">
              <SelectComponent
                title={activeFilterItem}
                list={Object.values(filterPeriodItems)}
                selectItem={(selected) =>
                  setActiveFilterItem(selected as stringFormatTypes)
                }
              />
            </div>
          </div>
          <div className="widget_graph">
            <Line data={dataChart} options={options} />
          </div>
        </>
      )}
    </div>
  );
};

export default WidgetStat;
