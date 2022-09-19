import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import SelectComponent from "../../../../components/SelectComponent";
import { filterItems } from "../../consts";

import "./styles.sass";
import axiosClient from "../../../../axiosClient";
import { useSelector } from "react-redux";

Chart.register(...registerables);

interface LineProps {
  data: ChartData<"line">;
  options?: ChartOptions<"line">;
}

const dataChart: LineProps = {
  data: {
    labels: ["2016", "2017", "2018", "2019", "2020", "2021"],

    datasets: [
      {
        label: "Кол-во спорткомплексов",
        data: [2, 5, 5, 6, 2, 7],
        fill: true,
        pointBackgroundColor: "rgba(29, 20, 255, 1)",
        backgroundColor: "rgba(29, 20, 255, 0.2)",
        borderColor: "rgba(29, 20, 255, 0.5)",
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "rgb(255, 255, 255)",
        },
        grid: {
          color: "#353535"
        }
      },
      x: {
        ticks: {
          color: "rgb(255, 255, 255)",
        },
        grid: {
          color: "#353535"
        }
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
    },
  },
};

const WidgetStat = ({ usdtKoef }: { usdtKoef: number }) => {
  const user: any = useSelector((state: any) => state.user);
  const [activeFilterItem, setActiveFilterItem] = useState(
    filterItems["7days"]
  );
  const [latestDonations, setLatestDonations] = useState<any[]>([]);

  const getLatestDonations = async (timePeriod: string) => {
    const { data } = await axiosClient.get(
      `/api/donation/widgets/stats/${user.id}?timePeriod=${timePeriod}`
    );
    data.donations &&
      data.donations.length &&
      setLatestDonations(data.donations);
  };

  useEffect(() => {
    const timePeriod = Object.keys(filterItems).find(
      (key: string) => filterItems[key] === activeFilterItem
    );
    user.id && timePeriod && getLatestDonations(timePeriod);
  }, [user, activeFilterItem]);

  return (
    <div className="widget widget-stat">
      <div className="widget_header">
        <span className="widget_header__title">Stats</span>
        <div className="widget_header__filter">
          <SelectComponent
            title={activeFilterItem}
            list={Object.values(filterItems)}
            selectItem={(selected) => setActiveFilterItem(selected)}
          />
        </div>
      </div>
      <div>
        <Line data={dataChart.data} options={dataChart.options} />
      </div>
    </div>
  );
};

export default WidgetStat;
