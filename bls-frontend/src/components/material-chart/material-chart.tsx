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

/**
 * Builds a cache key for time-series data.
 */
function buildCacheKey(seriesId: number, forecast: boolean, duration: string) {
  return `${seriesId}:${forecast ? "1" : "0"}:${duration}`;
}

/**
 * Gets a label for the given series ID.
 */
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

/**
 * Builds a date label based on year, month, and time unit.
 */
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

/**
 * Determines the time aggregation unit from existing data.
 */
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

/**
 * Renders the MaterialChart component.
 */
export default function MaterialChart() {
  const { selectedKeys } = useMaterialSelectionStore();
  const { chartData, setChartData } = useChartDataStore();

  const forecastEnabled = useForecastToggleStore((s) => s.forecastToggle);
  const rangeEnabled = useForecastToggleStore((s) => s.rangeToggle);

  const duration = useDurationStore((s) => s.duration);
  const { tableData } = useMaterialTableStore();

  const numericIds = useMemo(() => {
    return Array.from(selectedKeys)
      .filter((k) => /^\d+$/.test(k))
      .map(Number);
  }, [selectedKeys]);

  /**
   * Fetches missing time-series data for the given IDs if not already in chartData.
   */
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

  /**
   * Debounced function to delay fetching of missing IDs.
   */
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
    () => buildChartConfig(loadedSeries, tableData, rangeEnabled),
    [loadedSeries, tableData, rangeEnabled]
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
          unit: "month" as "month",
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

/**
 * Builds configured datasets and labels for the chart.
 */
function buildChartConfig(
  loadedSeries: { id: number; data?: TimeSeriesData }[],
  materialData: MaterialDetail[],
  rangeEnabled: boolean
) {
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

  const colors = [
    "rgba(75,192,192,1)",
    "rgba(255,99,132,1)",
    "rgba(54,162,235,1)",
    "rgba(153,102,255,1)",
    "rgba(255,159,64,1)",
  ];
  let colorIndex = 0;

  const datasets = loadedSeries.flatMap(({ id, data }) => {
    if (!data) return [];

    const baseLabel = getSeriesLabel(id, materialData);
    const timeUnit = determineTimeUnit(data);
    const color = colors[colorIndex % colors.length];
    colorIndex++;

    const existingMap = new Map<string, number>();
    (data.existing_data || []).forEach((pt) => {
      const key = buildDateKey(pt.year, pt.month, timeUnit);
      existingMap.set(key, pt.value);
    });

    const forecastMap = new Map<string, number>();
    const forecastMapLower = new Map<string, number>();
    const forecastMapUpper = new Map<string, number>();

    (data.forecasted_data || []).forEach((pt) => {
      const key = buildDateKey(pt.year, pt.month, timeUnit);
      forecastMap.set(key, pt.yhat);
      forecastMapLower.set(key, pt.yhat_lower);
      forecastMapUpper.set(key, pt.yhat_upper);
    });

    const existingData = dateLabels.map((d) => {
      const key = buildDateKey(d.getFullYear(), d.getMonth() + 1, timeUnit);
      return existingMap.get(key) ?? null;
    });

    const forecastData = dateLabels.map((d) => {
      const key = buildDateKey(d.getFullYear(), d.getMonth() + 1, timeUnit);
      return forecastMap.get(key) ?? null;
    });

    const forecastDataLower = dateLabels.map((d) => {
      const key = buildDateKey(d.getFullYear(), d.getMonth() + 1, timeUnit);
      return forecastMapLower.get(key) ?? null;
    });

    const forecastDataUpper = dateLabels.map((d) => {
      const key = buildDateKey(d.getFullYear(), d.getMonth() + 1, timeUnit);
      return forecastMapUpper.get(key) ?? null;
    });

    function createBridgingData(
      forecastArr: (number | null)[],
      existingArr: (number | null)[]
    ) {
      const lastExistingIndex = existingArr.reduce<number>(
        (acc, val, idx) => (val != null ? idx : acc),
        -1
      );
      const firstForecastIndex = forecastArr.findIndex((val) => val != null);

      const bridging = new Array(existingArr.length).fill(null);
      if (
        lastExistingIndex !== -1 &&
        firstForecastIndex !== -1 &&
        firstForecastIndex > lastExistingIndex
      ) {
        bridging[lastExistingIndex] = existingArr[lastExistingIndex];
        bridging[firstForecastIndex] = forecastArr[firstForecastIndex];
      }
      return bridging;
    }

    const bridgingDataCentral = createBridgingData(forecastData, existingData);
    const bridgingDataLower = createBridgingData(
      forecastDataLower,
      existingData
    );
    const bridgingDataUpper = createBridgingData(
      forecastDataUpper,
      existingData
    );

    const forecastLabel = rangeEnabled ? `${baseLabel} (Forecast)` : "";
    const forecastDataset = {
      label: forecastLabel,
      data: forecastData,
      borderColor: color,
      borderDash: [5, 5],
      backgroundColor: "rgba(0,0,0,0)",
      spanGaps: false,
      pointRadius: 1.5,
      pointHoverRadius: 2,
      order: 10,
    };

    const bridgingCentral = {
      label: "",
      data: bridgingDataCentral,
      borderColor: color,
      borderDash: [5, 5],
      backgroundColor: "rgba(0,0,0,0)",
      spanGaps: false,
      pointRadius: 0,
      order: 9,
    };

    let bridgingRange: any[] = [];
    let rangeDatasets: any[] = [];

    if (rangeEnabled) {
      bridgingRange = [
        {
          label: "",
          data: bridgingDataLower,
          borderColor: "red",
          borderDash: [5, 5],
          backgroundColor: "rgba(0,0,0,0)",
          spanGaps: false,
          pointRadius: 0,
          order: 9,
        },
        {
          label: "",
          data: bridgingDataUpper,
          borderColor: "green",
          borderDash: [5, 5],
          backgroundColor: "rgba(0,0,0,0)",
          spanGaps: false,
          pointRadius: 0,
          order: 9,
        },
      ];

      rangeDatasets = [
        {
          label: `${baseLabel} (Forecast Lower)`,
          data: forecastDataLower,
          borderColor: "red",
          borderDash: [5, 5],
          backgroundColor: "rgba(0,0,0,0)",
          spanGaps: true,
          pointRadius: 0,
          pointHoverRadius: 0,
          order: 10,
        },
        {
          label: `${baseLabel} (Forecast Upper)`,
          data: forecastDataUpper,
          borderColor: "green",
          borderDash: [5, 5],
          backgroundColor: "rgba(0,0,0,0)",
          spanGaps: true,
          pointRadius: 0,
          pointHoverRadius: 0,
          order: 10,
        },
      ];
    }

    const actualLabel = rangeEnabled ? `${baseLabel} (Actual)` : baseLabel;
    const existingDataset = {
      label: actualLabel,
      data: existingData,
      borderColor: color,
      backgroundColor: color,
      spanGaps: true,
      pointRadius: 1.5,
      pointHoverRadius: 2,
      order: 1,
    };

    return [
      existingDataset,
      bridgingCentral,
      ...bridgingRange,
      forecastDataset,
      ...rangeDatasets,
    ];
  });

  return {
    labels: dateLabels,
    datasets,
  };
}

/**
 * Renders a legend for the chart.
 */
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
