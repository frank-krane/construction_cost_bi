"use client";

import React, { useEffect, useRef } from "react";
import { TimeSeriesDataResponse } from "../types/timeSeries";
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
  TimeScale,
  Filler,
  TooltipItem,
} from "chart.js";
import 'chartjs-adapter-date-fns';
import { Line } from "@uconn-its/react-chartjs-2-react19-temp";

ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  TimeScale,
  Filler
);

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

interface MaterialChartProps {
  timeSeriesMap: TimeSeriesDataResponse;
}

const colors = [
  "rgba(75,192,192,1)",
  "rgba(255,99,132,1)",
  "rgba(54,162,235,1)",
  "rgba(255,206,86,1)",
  "rgba(153,102,255,1)",
  "rgba(255,159,64,1)",
  // Add more colors as needed
];

const MaterialChart: React.FC<MaterialChartProps> = ({ timeSeriesMap }) => {
  const chartRef = useRef<ChartJS<"line"> | null>(null);

  const allLabelsSet = new Set<string>();
  Object.entries(timeSeriesMap).forEach(([seriesId, tsData]) => {
    if (!tsData) {
      console.warn(`TimeSeriesData for seriesId ${seriesId} is undefined`);
      return;
    }
    const existingData = Array.isArray(tsData.existing_data) ? tsData.existing_data : [];
    existingData.forEach(data => {
      allLabelsSet.add(`${data.year}-${data.month}`);
    });
    const forecastData = Array.isArray(tsData.forecasted_data) ? tsData.forecasted_data : [];
    forecastData.forEach(data => {
      allLabelsSet.add(`${data.year}-${data.month}`);
    });
  });

  const allLabels = Array.from(allLabelsSet).sort((a, b) => {
    const [yearA, monthA] = a.split("-").map(Number);
    const [yearB, monthB] = b.split("-").map(Number);
    return yearA === yearB ? monthA - monthB : yearA - yearB;
  }).map(label => {
    const [year, month] = label.split("-").map(Number);
    return new Date(year, month - 1);
  });

  const datasets = Object.entries(timeSeriesMap).flatMap(([seriesId, tsData], idx) => {
    if (!tsData) {
      return [];
    }
    const color = colors[idx % colors.length];
    const existingDataMap = new Map<string, number>();
    if (tsData.existing_data && Array.isArray(tsData.existing_data)) {
      tsData.existing_data.forEach(data => {
        existingDataMap.set(`${data.year}-${data.month}`, data.value);
      });
    }

    const forecastDataMap = new Map<string, number>();
    if (tsData.forecasted_data && Array.isArray(tsData.forecasted_data)) {
      tsData.forecasted_data.forEach(data => {
        forecastDataMap.set(`${data.year}-${data.month}`, data.yhat);
      });
    }

    const sortedExistingKeys = Array.from(existingDataMap.keys()).sort((a, b) => {
      const [yearA, monthA] = a.split("-").map(Number);
      const [yearB, monthB] = b.split("-").map(Number);
      return yearA === yearB ? monthA - monthB : yearA - yearB;
    });
    const lastExistingKey = sortedExistingKeys[sortedExistingKeys.length - 1];
    const [lastYear, lastMonth] = lastExistingKey.split("-").map(Number);
    const lastExistingDate = new Date(lastYear, lastMonth - 1);

    return [
      {
        label: `Series ${seriesId} - Existing`,
        data: allLabels.map(date => {
          const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
          return existingDataMap.get(key) ?? null;
        }),
        borderColor: color,
        backgroundColor: "rgba(0, 0, 0, 0)",
        spanGaps: true,
      },
      {
        label: `Series ${seriesId} - Forecast`,
        data: allLabels.map(date => {
          const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
          if (date.getTime() === lastExistingDate.getTime()) {
            return existingDataMap.get(key) ?? forecastDataMap.get(key) ?? null;
          }
          return forecastDataMap.get(key) ?? null;
        }),
        borderColor: color,
        borderDash: [5, 5],
        backgroundColor: "rgba(0, 0, 0, 0)",
        spanGaps: true,
      },
    ];
  });

  const data = {
    labels: allLabels,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Added to allow the chart to take available space
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
            const value = context.parsed.y;
            const date = context.label;
            return `${label}: ${value} (${new Date(date).toLocaleDateString()})`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'month' as const,
          tooltipFormat: 'MMM yyyy',
        },
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
  }, [timeSeriesMap]);

  return (
      <Line ref={chartRef} data={data} options={options} />
  );
};

export default MaterialChart;
