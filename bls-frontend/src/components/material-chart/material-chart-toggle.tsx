"use client";

import {
  ForecastToggleState,
  useForecastToggleStore,
} from "@/store/include-forecast-store";
import { Switch } from "@nextui-org/switch";

export default function MaterialChartToggle() {
  return (
    <>
      <div className="flex justify-start">
        <div className="pr-2 flex align-middle justify-center">
          Include Range
        </div>
        <div>
          <Switch
            checked={useForecastToggleStore(
              (state: ForecastToggleState) => state.rangeToggle
            )}
            onChange={(event) =>
              useForecastToggleStore
                .getState()
                .setRangeToggle((event.target as HTMLInputElement).checked)
            }
          />
        </div>
      </div>

      <div className="flex justify-end">
        <div className="pr-2 flex align-middle justify-center">Forecast</div>
        <div>
          <Switch
            checked={useForecastToggleStore(
              (state: ForecastToggleState) => state.forecastToggle
            )}
            onChange={(event) =>
              useForecastToggleStore
                .getState()
                .setForecastToggle((event.target as HTMLInputElement).checked)
            }
          />
        </div>
      </div>
    </>
  );
}
