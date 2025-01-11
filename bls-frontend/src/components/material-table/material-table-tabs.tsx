"use client";

import { MaterialTableGroupBy } from "@/app/constants/types";
import { GroupByState, useGroupByStore } from "@/store/material-group-by-store";
import { Tab, Tabs } from "@nextui-org/tabs";

/**
 * Renders the MaterialTableTabs component.
 */
export default function MaterialTableTabs() {
  return (
    <Tabs
      selectedKey={useGroupByStore((state: GroupByState) => state.groupBy)}
      fullWidth
      onSelectionChange={(key) =>
        useGroupByStore.setState({ groupBy: key as MaterialTableGroupBy })
      }
    >
      <Tab key={MaterialTableGroupBy.Material} title="Group by Material" />
      <Tab key={MaterialTableGroupBy.Region} title="Group by Region" />
      <Tab key={MaterialTableGroupBy.Type} title="Group by Type" />
    </Tabs>
  );
}
