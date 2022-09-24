import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import { Skeleton } from "antd";
import SelectComponent from "../../../../components/SelectComponent";
import { filterPeriodItems, getTimePeriodQuery } from "../../../../consts";
import axiosClient from "../../../../axiosClient";
import { useSelector } from "react-redux";
import { DateFormatter } from "../../../../utils";
import "./styles.sass";

Chart.register(...registerables);

const options: ChartOptions<"line"> = {
  scales: {
    y: {
      beginAtZero: true,

      ticks: {
        color: "rgb(255, 255, 255)",
        callback: (value) => value + " USD",
      },
      grid: {
        color: "#353535",
      },
    },
    x: {
      ticks: {
        color: "rgb(255, 255, 255)",
      },
      grid: {
        color: "#353535",
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      labels: {
        color: "rgb(255, 255, 255)",
      },
      onClick: (e, legendItem, legend) => null,
    },

    tooltip: {
      callbacks: {
        label: ({ formattedValue }) => formattedValue + " USD",
      },
    },
  },
};

const dateFormat: { [key: string]: string } = {
  Today: "HH:mm",
  "Last 7 days": "dddd",
  "Last 30 days": "DD/MM/YYYY",
  "This year": "MMMM",
};

const WidgetStat = ({ usdtKoef }: { usdtKoef: number }) => {
  const user: any = useSelector((state: any) => state.user);

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
  const getLatestDonations = async (timePeriod: string) => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(
        `/api/donation/widgets/stats/${user.id}?timePeriod=${timePeriod}`
      );
      if (data) {
        const labels = data.map((donat: any) =>
          DateFormatter(donat.date_group, dateFormat[activeFilterItem])
        );
        const values = data.map(
          (donat: any) => +(+donat.sum_donation * usdtKoef).toFixed(0)
        );

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
  }, [user, activeFilterItem, usdtKoef]);

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
                selectItem={(selected) => setActiveFilterItem(selected)}
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
