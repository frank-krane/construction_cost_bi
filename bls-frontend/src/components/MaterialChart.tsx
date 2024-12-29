"use client";

import React, { useEffect, useRef } from "react";
import { TimeSeriesData } from "../types/timeSeries";
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  Filler,
  TooltipItem,
} from "chart.js";
import { Line } from "@uconn-its/react-chartjs-2-react19-temp"; // Update this import to the correct package when react-chartjs-2 is updated to support react 19

ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  Filler
);

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

interface MaterialChartProps {
  timeSeriesData: TimeSeriesData;
}

const MaterialChart: React.FC<MaterialChartProps> = ({ timeSeriesData }) => {
  const chartRef = useRef<ChartJS<"line"> | null>(null);

  const historicalData = timeSeriesData.existing_data.slice().reverse();
  const forecastedData = timeSeriesData.forecasted_data || [];

  const data = {
    labels: [
      ...historicalData.map((data) => `${data.year} ${monthNames[data.month - 1]}`),
      ...forecastedData.map((data) => `${data.year} ${monthNames[data.month - 1]}`),
    ],
    datasets: [
      {
        label: "Existing Data",
        data: historicalData.map((data) => data.value),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
      },
      {
        label: "Forecasted Data",
        data: [
          ...Array(historicalData.length - 1).fill(null),
          historicalData[historicalData.length - 1]?.value,
          ...forecastedData.map((data) => data.yhat),
        ],
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.1)",
        fill: "start",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Material Time Series Data",
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"line">) {
            const label = context.dataset.label || '';
            const value = context.raw;
            const date = context.label;
            return `${label}: ${value} (${date})`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [timeSeriesData]);


  return <Line ref={chartRef} data={data} options={options} />;
};

export default MaterialChart;
