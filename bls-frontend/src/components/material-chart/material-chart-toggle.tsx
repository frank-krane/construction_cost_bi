// ✅ Safe version
"use client";

import { useForecastToggleStore } from "@/store/include-forecast-store";
import { Switch } from "@nextui-org/switch";

export default function MaterialChartToggle() {
  // Always call these Hooks, regardless of forecastToggle's value
  const forecastToggle = useForecastToggleStore((s) => s.forecastToggle);
  const rangeToggle = useForecastToggleStore((s) => s.rangeToggle);
  const setForecastToggle = useForecastToggleStore((s) => s.setForecastToggle);
  const setRangeToggle = useForecastToggleStore((s) => s.setRangeToggle);

  const handleForecastChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForecastToggle(event.target.checked);
  };

  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRangeToggle(event.target.checked);
  };

  return (
    <>
      <div className="flex justify-between w-full">
        <div className="flex justify-end">
          <div className="pr-2 flex align-middle justify-center">Forecast</div>
          <div>
            <Switch checked={forecastToggle} onChange={handleForecastChange} />
          </div>
        </div>

        {forecastToggle && (
          <div className="flex justify-end">
            <div className="pr-2 flex align-middle justify-center">
              Include Range
            </div>
            <div>
              <Switch checked={rangeToggle} onChange={handleRangeChange} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
