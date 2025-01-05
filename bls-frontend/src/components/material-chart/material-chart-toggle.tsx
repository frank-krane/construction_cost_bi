"use client";

import {
  ForecastToggleState,
  useForecastToggleStore,
} from "@/store/include-forecast-store";
import { Switch } from "@nextui-org/switch";

export default function MaterialChartToggle() {
  return (
    <div className="flex justify-end">
      <div className="pr-2 flex align-middle justify-center">Forecast</div>
      <div>
        <Switch
          checked={useForecastToggleStore(
            (state: ForecastToggleState) => state.forecastToggle
          )}
          onChange={(event) =>
            useForecastToggleStore.setState({
              forecastToggle: (event.target as HTMLInputElement).checked,
            })
          }
        ></Switch>
      </div>
    </div>
  );
}
