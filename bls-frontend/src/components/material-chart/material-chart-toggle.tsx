"use client";

import {
  ForecastToggleState,
  useForecastToggleStore,
} from "@/store/include-forecast-store";
import { Switch } from "@nextui-org/switch";

export default function MaterialChartToggle() {
  return (
    <Switch
      checked={useForecastToggleStore(
        (state: ForecastToggleState) => state.forecastToggle
      )}
      onChange={(event) =>
        useForecastToggleStore.setState({
          forecastToggle: (event.target as HTMLInputElement).checked,
        })
      }
    >
      Forecast
    </Switch>
  );
}
