import { ChartOptions } from "chart.js";
import { periodItemsTypes } from "types";
import dayjsModule from "modules/dayjsModule";

export const options: ChartOptions<"line"> = {
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

type periodFormatTypes = "HH:mm" | "dddd" | "DD/MM/YYYY" | "MMMM";

type IDateFormat = {
  [key in periodItemsTypes]: periodFormatTypes;
};

export const dateFormat: IDateFormat = {
  today: "HH:mm",
  "7days": "dddd",
  "30days": "DD/MM/YYYY",
  year: "MMMM",
};

type periodEnumerateTypes = "hours" | "days" | "months";

export const periodTypes: { [key in periodItemsTypes]: periodEnumerateTypes } =
  {
    today: "hours",
    "7days": "days",
    "30days": "days",
    year: "months",
  };

type subtractDateTypes = "0_day" | "7_day" | "30_day" | "1_year";

export const subtractDate: { [key in periodItemsTypes]: subtractDateTypes } = {
  today: "0_day",
  "7days": "7_day",
  "30days": "30_day",
  year: "1_year",
};

interface IEnumerateDates {
  startDate: number;
  endDate: number;
  timePeriod: periodItemsTypes;
}

export const enumerateBetweenDates = ({
  startDate,
  endDate,
  timePeriod,
}: IEnumerateDates) => {
  let m = dayjsModule(startDate).add(1, periodTypes[timePeriod]);
  const dates = [];

  while (m.isBefore(endDate)) {
    dates.push(m.format(dateFormat[timePeriod]));
    m = m.add(1, periodTypes[timePeriod]);
  }
  return dates;
};
