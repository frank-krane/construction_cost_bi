"use client";

import React, { useState, useEffect } from "react";
import MaterialList from "@/components/MaterialList";
import { TimeSeriesDataResponse } from "@/types/timeSeries";
import MaterialChart from "../components/MaterialChart";
import { getTimeSeriesData } from "../services/timeSeries";
import { Switch } from "@nextui-org/switch";
import { Tabs, Tab } from "@nextui-org/tabs";

export default function Home() {
  const [selectedSeriesIds, setSelectedSeriesIds] = useState<string[]>([]);
  const [selectedTimeSeriesData, setSelectedTimeSeriesData] = useState<TimeSeriesDataResponse | null>(null);
  const [forecastEnabled, setForecastEnabled] = useState<boolean>(false);
  const [duration, setDuration] = useState<string>("5Y");

  useEffect(() => {
    // TODO: Add this logic to utils function
    const numericIds = selectedSeriesIds
      .filter(k => /^\d+$/.test(k))
      .map(k => parseInt(k, 10));
    if (numericIds.length === 0) {
      setSelectedTimeSeriesData(null);
      return;
    }

    getTimeSeriesData(numericIds, forecastEnabled, duration)
      .then((timeSeriesMap) => {
        setSelectedTimeSeriesData(timeSeriesMap);
      })
      .catch(console.error);
  }, [selectedSeriesIds, forecastEnabled, duration]);

  const handleForecastSwitch = async (checked: boolean) => {
    setForecastEnabled(checked);
  };

  const handleDurationChange = async (key: React.Key) => {
    const durationKey = key.toString();
    setDuration(durationKey);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <section className="flex flex-col gap-8 items-center sm:items-start w-full">
        <h2 className="text-xl font-bold">Material List</h2>
        <MaterialList
          selectedKeys={selectedSeriesIds}
          setSelectedKeys={(keys: string[]) => setSelectedSeriesIds(keys)}
        />
      </section>
      <section className="flex flex-col gap-8 items-center sm:items-start w-full">
        <h2 className="text-xl font-bold">Chart</h2>
        {selectedSeriesIds.length > 0 && selectedTimeSeriesData && (
          <>
            <div className="flex items-center gap-4">
              <span>Forecast</span>
              <Switch
                checked={forecastEnabled}
                onChange={(e) => handleForecastSwitch(e.target.checked)}
                color="primary"
                size="lg"
              />
            </div>
            <Tabs selectedKey={duration} onSelectionChange={handleDurationChange}>
              <Tab key="1Y" title="1 Year" />
              <Tab key="5Y" title="5 Years" />
              <Tab key="10Y" title="10 Years" />
              <Tab key="Max" title="Max" />
            </Tabs>
            <div style={{ width: '100%', height: '400px' }}> {/* Set a fixed height or use responsive units */}
              <MaterialChart timeSeriesMap={selectedTimeSeriesData} />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
