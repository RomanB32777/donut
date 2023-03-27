import { useEffect, useMemo, useState } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import type { ChartData } from "chart.js";
import { FormattedMessage } from "react-intl";
import { periodItemsTypes } from "types";

import WidgetLoader from "../WidgetLoader";
import FilterSelect from "../FilterSelect";

import dayjsModule, { ManipulateType } from "modules/dayjsModule";
import { useAppSelector } from "hooks/reduxHooks";
import { useGetWidgetDonationsQuery } from "store/services/DonationsService";
import { getTimePeriodQuery, DateFormatter, formatNumber } from "utils";
import {
  dateFormat,
  enumerateBetweenDates,
  options,
  subtractDate,
} from "./graphData";
import { filterPeriodItems } from "consts";

Chart.register(...registerables);

const initChartData: ChartData<"line"> = {
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
};

const WidgetStat = () => {
  const { id } = useAppSelector(({ user }) => user);
  const { list, shouldUpdateApp } = useAppSelector(
    ({ notifications }) => notifications
  );

  const [activeFilterItem, setActiveFilterItem] = useState(
    filterPeriodItems["7days"]
  );

  const timePeriod = useMemo(
    () => getTimePeriodQuery(activeFilterItem),
    [activeFilterItem]
  );

  const selectChartData = useMemo(
    () =>
      createSelector(
        (res: any) => res.data,
        (res: any, timePeriod: periodItemsTypes) => timePeriod,
        (data, timePeriod) => {
          if (data) {
            const subtractedDate = subtractDate[timePeriod].split("_");
            const filteredDates = {
              start: dayjsModule()
                .subtract(
                  +subtractedDate[0],
                  subtractedDate[1] as ManipulateType
                )
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
                [date]: +formatNumber(d.sum),
              };
            }, initGroupDates as { [key: string]: number });

            const labels = Object.keys(groupDonats).map((date: string) => date);
            const values = Object.values(groupDonats).map((sum: any) => sum);

            const dataChart: ChartData<"line"> = {
              ...initChartData,
              labels,
              datasets: [
                {
                  ...initChartData.datasets[0],
                  data: values,
                },
              ],
            };

            return dataChart;
          }
          return initChartData;
        }
      ),
    []
  );

  const { dataChart, isLoading, refetch } = useGetWidgetDonationsQuery(
    {
      userId: id,
      dataType: "stats",
      query: {
        timePeriod,
      },
    },
    {
      skip: !id,
      selectFromResult: (result) => ({
        ...result,
        dataChart: selectChartData(result, timePeriod),
      }),
    }
  );

  useEffect(() => {
    list.length && shouldUpdateApp && refetch();
  }, [list, shouldUpdateApp]);

  return (
    <div className="widget widget-stat">
      {isLoading ? (
        <WidgetLoader />
      ) : (
        <>
          <div className="header">
            <span className="widget-title">
              <FormattedMessage id="dashboard_widgets_stats" />
            </span>
            <FilterSelect
              selectedItem={activeFilterItem}
              selectItem={setActiveFilterItem}
            />
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
