import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import type { ChartData } from "chart.js";
import { periodItemsTypes, stringFormatTypes } from "types";

import SelectComponent from "components/SelectComponent";
import WidgetLoader from "../WidgetLoader";

import dayjsModule, { ManipulateType } from "modules/dayjsModule";
import { useAppSelector } from "hooks/reduxHooks";
import { getTimePeriodQuery, DateFormatter, formatNumber } from "utils";
import axiosClient from "modules/axiosClient";
import {
  dateFormat,
  enumerateBetweenDates,
  options,
  subtractDate,
} from "./graphData";
import { filterPeriodItems, widgetApiUrl } from "consts";

Chart.register(...registerables);

const WidgetStat = () => {
  const { user, notifications } = useAppSelector((state) => state);
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

  const { id } = user;
  const { list, shouldUpdateApp } = notifications;

  const getLatestDonations = async (timePeriod: periodItemsTypes) => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(
        `${widgetApiUrl}/stats/${id}?timePeriod=${timePeriod}`
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
            [date]: +formatNumber(d.sum_donation),
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
    id && getLatestDonations(timePeriod);
  }, [id, activeFilterItem]);

  useEffect(() => {
    const timePeriod = getTimePeriodQuery(activeFilterItem);
    list.length && shouldUpdateApp && getLatestDonations(timePeriod);
  }, [list, shouldUpdateApp]);

  return (
    <div className="widget widget-stat">
      {loading ? (
        <WidgetLoader />
      ) : (
        <>
          <div className="header">
            <span className="widget-title">Stats</span>
            <div className="filter">
              <SelectComponent
                title={activeFilterItem}
                list={Object.values(filterPeriodItems)}
                selectItem={(selected) =>
                  setActiveFilterItem(selected as stringFormatTypes)
                }
                listWrapperModificator="filter-list"
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
