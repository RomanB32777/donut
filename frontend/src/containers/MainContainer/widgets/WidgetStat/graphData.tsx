import { ChartOptions } from "chart.js";

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
  
export const dateFormat: { [key: string]: string } = {
    Today: "HH:mm",
    "Last 7 days": "dddd",
    "Last 30 days": "DD/MM/YYYY",
    "This year": "MMMM",
  };