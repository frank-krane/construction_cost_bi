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
  CategoryScale
);

interface MaterialChartProps {
  timeSeriesData: TimeSeriesData;
}

const MaterialChart: React.FC<MaterialChartProps> = ({ timeSeriesData }) => {
  const chartRef = useRef<ChartJS<"line"> | null>(null);

  const historicalData = timeSeriesData.existing_data.slice().reverse();
  const forecastedData = timeSeriesData.forecasted_data;

  const data = {
    labels: [
      ...historicalData.map((data) => `${data.year}-${data.month}`),
      ...forecastedData.map((data) => `${data.year}-${data.month}`),
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
