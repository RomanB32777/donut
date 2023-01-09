import { useContext, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import type { ChartData } from "chart.js";
import { Skeleton } from "antd";
import { periodItemsTypes, stringFormatTypes } from "types";

import SelectComponent from "components/SelectComponent";
import { useAppSelector } from "hooks/reduxHooks";
import { WalletContext } from "contexts/Wallet";
import { getTimePeriodQuery, DateFormatter } from "utils";
import axiosClient from "modules/axiosClient";
import dayjsModule, { ManipulateType } from "modules/dayjsModule";
import {
  dateFormat,
  enumerateBetweenDates,
  options,
  subtractDate,
} from "./graphData";
import { filterPeriodItems, widgetApiUrl } from "consts";
import "./styles.sass";

Chart.register(...registerables);

const WidgetStat = ({ usdtKoef }: { usdtKoef: number }) => {
  const { user, notifications } = useAppSelector((state) => state);
  const { walletConf } = useContext(WalletContext);

  const [loading, setLoading] = useState<boolean>(true);
  const [dataChart, setDataChart] = useState<ChartData<"line">>({
    labels: [],
    datasets: [
      {
        label: "Donation sum",
        data: [],
        fill: true,
        pointBackgroundColor: "rgba(233, 69, 96, 1)",
        backgroundColor: "rgba(233, 69, 96, 0.2)",
        borderColor: "rgba(233, 69, 96, 0.5)",
      },
    ],
  });

  const [activeFilterItem, setActiveFilterItem] = useState(
    filterPeriodItems["7days"]
  );

  const { list, shouldUpdateApp } = notifications;

  const getLatestDonations = async (timePeriod: periodItemsTypes) => {
    try {
      setLoading(true);
      const currBlockchain = await walletConf.getCurrentBlockchain();

      if (currBlockchain) {
        const blockchain = currBlockchain.name;
        const { data } = await axiosClient.get(
          `${widgetApiUrl}/stats/${user.id}?timePeriod=${timePeriod}&blockchain=${blockchain}`
        );

        if (data) {
          const subtractedDate = subtractDate[timePeriod].split("_");

          const filteredDates = {
            start: dayjsModule()
              .subtract(+subtractedDate[0], subtractedDate[1] as ManipulateType)
              .startOf("day")
              .valueOf(),
            end: dayjsModule().endOf("day").valueOf(),
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
      } else setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timePeriod = getTimePeriodQuery(activeFilterItem);

    user.id &&
      timePeriod &&
      shouldUpdateApp &&
      usdtKoef &&
      getLatestDonations(timePeriod);
  }, [user, activeFilterItem, usdtKoef, list, shouldUpdateApp]);

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
