"use client";

import { MaterialChartPeriod } from "@/app/constants/types";
import {
  DurationState,
  useDurationStore,
} from "@/store/material-duration-tab-store";
import { Tab, Tabs } from "@nextui-org/tabs";

/**
 * Renders the MaterialChartTabs component.
 */
export default function MaterialChartTabs() {
  return (
    <Tabs
      selectedKey={useDurationStore((state: DurationState) => state.duration)}
      fullWidth
      onSelectionChange={(key) =>
        useDurationStore.setState({ duration: key as MaterialChartPeriod })
      }
    >
      <Tab key={MaterialChartPeriod.OneYear} title="1 Year" />
      <Tab key={MaterialChartPeriod.FiveYears} title="5 Years" />
      <Tab key={MaterialChartPeriod.TenYears} title="10 Years" />
      <Tab key={MaterialChartPeriod.Max} title="Max" />
    </Tabs>
  );
}
