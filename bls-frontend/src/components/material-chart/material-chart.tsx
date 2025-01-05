"use client";

import React, { useEffect, useMemo } from "react";
import { debounce } from "@/app/utils/material-utils";
import { Line } from "@uconn-its/react-chartjs-2-react19-temp";

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
} from "chart.js";
import "chartjs-adapter-date-fns";

import { useMaterialSelectionStore } from "@/store/material-selection-store";
import { useChartDataStore } from "@/store/chart-data-store";
import { useForecastToggleStore } from "@/store/include-forecast-store";
import { useDurationStore } from "@/store/material-duration-tab-store";
import { useMaterialTableStore } from "@/store/material-table-store";
import { TimeSeriesData, TimeSeriesDataResponse } from "@/app/constants/types";
import { MaterialDetail } from "@/app/constants/types";
import { fetchTimeSeriesBatch } from "@/services/material-service";

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

function buildCacheKey(seriesId: number, forecast: boolean, duration: string) {
  return `${seriesId}:${forecast ? "1" : "0"}:${duration}`;
}

function getSeriesLabel(seriesId: number, materialData: MaterialDetail[]) {
  for (const mat of materialData) {
    for (const ser of mat.series) {
      if (ser.id === seriesId) {
        return `${mat.materialName} - ${ser.region.regionName}`;
      }
    }
  }
  return `Series ${seriesId}`;
}

function buildDateKey(year: number, month: number, unit: string) {
  if (unit === "quarter") {
    const quarter = Math.ceil(month / 3);
    return `${year}-Q${quarter}`;
  } else if (unit === "semi-annual") {
    const half = month <= 6 ? "H1" : "H2";
    return `${year}-${half}`;
  }
  return `${year}-${month}`;
}

function determineTimeUnit(data: TimeSeriesData) {
  const months = data.existing_data.map((pt) => pt.month);
  const uniqueMonths = new Set(months);
  if (uniqueMonths.size === 1) {
    return "annual";
  } else if (uniqueMonths.size <= 2) {
    return "semi-annual";
  } else if (uniqueMonths.size <= 4) {
    return "quarter";
  }
  return "month";
}

export default function MaterialChart() {
  const { selectedKeys } = useMaterialSelectionStore();
  const { chartData, setChartData } = useChartDataStore();
  const forecastEnabled = useForecastToggleStore((s) => s.forecastToggle);
  const duration = useDurationStore((s) => s.duration);
  const { tableData } = useMaterialTableStore();

  const numericIds = useMemo(() => {
    return Array.from(selectedKeys)
      .filter((k) => /^\d+$/.test(k))
      .map(Number);
  }, [selectedKeys]);

  async function fetchMissingIds(
    ids: number[],
    forecast: boolean,
    dur: string
  ) {
    const missing: number[] = [];
    for (const id of ids) {
      const cacheKey = buildCacheKey(id, forecast, dur);
      if (!chartData[cacheKey]) {
        missing.push(id);
      }
    }
    if (missing.length === 0) return;

    try {
      const response: TimeSeriesDataResponse = await fetchTimeSeriesBatch(
        missing,
        forecast,
        dur
      );
      const newDataMap: Record<string, TimeSeriesData> = {};
      for (const [idStr, data] of Object.entries(response)) {
        const idNum = Number(idStr);
        const key = buildCacheKey(idNum, forecast, dur);
        newDataMap[key] = data;
      }
      setChartData(newDataMap);
    } catch (error) {
      console.error("Error fetching time-series data:", error);
    }
  }

  const debouncedFetch = useMemo(
    () => debounce(fetchMissingIds, 500),
    [chartData]
  );

  useEffect(() => {
    if (numericIds.length > 0) {
      debouncedFetch(numericIds, forecastEnabled, duration);
    }
  }, [numericIds, forecastEnabled, duration, debouncedFetch]);

  const relevantData = useMemo(() => {
    return numericIds.map((id) => {
      const key = buildCacheKey(id, forecastEnabled, duration);
      return { id, data: chartData[key] };
    });
  }, [numericIds, forecastEnabled, duration, chartData]);

  const loadedSeries = relevantData.filter((r) => r.data);

  const { labels, datasets } = useMemo(
    () => buildChartConfig(loadedSeries, tableData),
    [loadedSeries, tableData]
  );

  if (loadedSeries.length === 0) {
    return <div className="text-center mt-60">No chart data selected.</div>;
  }

  const chartDataObj = { labels, datasets };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "month",
          tooltipFormat: "MMM yyyy",
        },
        grid: { display: false },
      },
      y: {
        grid: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="w-full h-[250px]">
      <Line data={chartDataObj} options={options} />
      <div style={{ marginTop: "1rem" }}>
        <ReactLegend datasets={chartDataObj.datasets} />
      </div>
    </div>
  );
}

function buildChartConfig(
  loadedSeries: { id: number; data?: TimeSeriesData }[],
  materialData: MaterialDetail[]
) {
  // A) gather all unique year-month strings
  const allLabelsSet = new Set<string>();
  for (const { data } of loadedSeries) {
    if (!data) continue;
    (data.existing_data || []).forEach((pt) =>
      allLabelsSet.add(`${pt.year}-${pt.month}`)
    );
    (data.forecasted_data || []).forEach((pt) =>
      allLabelsSet.add(`${pt.year}-${pt.month}`)
    );
  }
  const sortedLabels = Array.from(allLabelsSet).sort((a, b) => {
    const [yA, mA] = a.split("-").map(Number);
    const [yB, mB] = b.split("-").map(Number);
    return yA === yB ? mA - mB : yA - yB;
  });
  const dateLabels = sortedLabels.map((label) => {
    const [yy, mm] = label.split("-").map(Number);
    return new Date(yy, mm - 1);
  });

  // B) colors
  const colors = [
    "rgba(75,192,192,1)",
    "rgba(255,99,132,1)",
    "rgba(54,162,235,1)",
    "rgba(153,102,255,1)",
    "rgba(255,159,64,1)",
  ];
  let colorIndex = 0;

  // C) build datasets
  const datasets = loadedSeries.flatMap(({ id, data }) => {
    if (!data) return [];

    const baseLabel = getSeriesLabel(id, materialData);
    const timeUnit = determineTimeUnit(data);

    const color = colors[colorIndex % colors.length];
    colorIndex++;

    // Maps
    const existingMap = new Map<string, number>();
    (data.existing_data || []).forEach((pt) => {
      const key = buildDateKey(pt.year, pt.month, timeUnit);
      existingMap.set(key, pt.value);
    });

    const forecastMap = new Map<string, number>();
    (data.forecasted_data || []).forEach((pt) => {
      const key = buildDateKey(pt.year, pt.month, timeUnit);
      forecastMap.set(key, pt.yhat);
    });

    const existingData = dateLabels.map((d) => {
      const key = buildDateKey(d.getFullYear(), d.getMonth() + 1, timeUnit);
      return existingMap.get(key) ?? null;
    });
    const forecastData = dateLabels.map((d) => {
      const key = buildDateKey(d.getFullYear(), d.getMonth() + 1, timeUnit);
      return forecastMap.get(key) ?? null;
    });

    // Two main line datasets
    const mainDatasets = [
      {
        label: `${baseLabel}`,
        data: existingData,
        borderColor: color,
        backgroundColor: color,
        spanGaps: true,
        pointRadius: 1.5,
        pointHoverRadius: 2,
      },
      {
        label: ``,
        data: forecastData,
        borderColor: color,
        borderDash: [5, 5],
        backgroundColor: "rgba(0,0,0,0)",
        spanGaps: false,
        pointRadius: 1.5,
        pointHoverRadius: 2,
      },
    ];

    // Bridging line
    const bridgingData = new Array(existingData.length).fill(null);
    const lastExistingIndex = existingData.reduce(
      (acc, val, idx) => (val != null ? idx : acc),
      -1
    );
    const firstForecastIndex = forecastData.findIndex((val) => val != null);

    if (
      lastExistingIndex !== -1 &&
      firstForecastIndex !== -1 &&
      firstForecastIndex > lastExistingIndex
    ) {
      bridgingData[lastExistingIndex] = existingData[lastExistingIndex];
      bridgingData[firstForecastIndex] = forecastData[firstForecastIndex];
      mainDatasets.push({
        label: "",
        data: bridgingData,
        borderColor: color,
        borderDash: [5, 5],
        backgroundColor: "rgba(0,0,0,0)",
        spanGaps: false,
      });
    }
    return mainDatasets;
  });

  return {
    labels: dateLabels,
    datasets,
  };
}

function ReactLegend({ datasets }: { datasets: any[] }) {
  return (
    <div className="max-h-52 overflow-y-auto mb-auto">
      <ul
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          margin: 0,
          padding: 0,
          listStyle: "none",
        }}
      >
        {datasets.map((item, idx) => {
          if (!item.label) return null;
          return (
            <li
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  background: item.borderColor,
                  display: "inline-block",
                  minWidth: "20px",
                  minHeight: "20px",
                  marginRight: "10px",
                }}
              />
              <p style={{ margin: 0, padding: 0 }}>{item.label}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
