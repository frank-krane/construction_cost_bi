"use client";

import { useForecastToggleStore } from "@/store/include-forecast-store";
import { Switch } from "@nextui-org/switch";
import { Tooltip } from "@nextui-org/tooltip";
import Image from "next/image";
import infoIcon from "@/../public/info-icon.svg";

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
      <div className="flex justify-between w-full ml-16 mr-16">
        <div className="flex justify-end">
          <div className="pr-2 flex align-middle justify-center">Forecast</div>
          <div>
            <Switch checked={forecastToggle} onChange={handleForecastChange} />
          </div>
        </div>

        {forecastToggle && (
          <div className="flex justify-end">
            <div className="mr-2 flex items-center justify-start">
              <Tooltip
                offset={1}
                content="You can only view range for one item at a time."
              >
                <Image
                  priority
                  src={infoIcon}
                  height={24}
                  width={24}
                  alt="Information about the range toggle"
                  className="cursor-pointer"
                />
              </Tooltip>
            </div>
            <div className="pr-2 flex items-center justify-center">
              Include Range
            </div>
            <div className="flex items-center justify-center">
              <Switch checked={rangeToggle} onChange={handleRangeChange} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
