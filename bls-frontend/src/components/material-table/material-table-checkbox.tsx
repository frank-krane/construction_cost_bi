"use client";

import { Checkbox } from "@nextui-org/checkbox";
import { Tooltip } from "@nextui-org/tooltip";
import { useMaterialSelectionStore } from "@/store/material-selection-store";
import { useForecastToggleStore } from "@/store/include-forecast-store";
import { MouseEvent } from "react";

interface MaterialTableCheckboxProps {
  groupKey?: string;
  rowKeys?: string[];
  rowKey?: string;
  isDisabled?: boolean;
  disabledTooltip?: string; // Optional: custom tooltip text for disabled checkboxes
}

export default function MaterialTableCheckbox({
  groupKey,
  rowKeys,
  rowKey,
  isDisabled = false,
  disabledTooltip,
}: MaterialTableCheckboxProps) {
  const { selectedKeys, toggleGroup, toggleRow } = useMaterialSelectionStore();
  const rangeToggle = useForecastToggleStore((s) => s.rangeToggle);

  // We'll pick a default tooltip message if not provided
  const maxItems = rangeToggle ? 1 : 5;
  const fallbackTooltip = `You can’t select more than ${maxItems} item${
    maxItems > 1 ? "s" : ""
  }.`;

  const tooltipText = disabledTooltip || fallbackTooltip;

  // Determine if the checkbox is currently selected:
  let isSelected = false;
  if (groupKey && rowKeys) {
    // Group mode: selected if ALL rowKeys are selected
    isSelected = rowKeys.every((rk) => selectedKeys.has(rk));
  } else if (rowKey) {
    // Row mode
    isSelected = selectedKeys.has(rowKey);
  }

  // Handle the checkbox change:
  const handleChange = (e: MouseEvent) => {
    e.stopPropagation();
    if (groupKey && rowKeys) {
      toggleGroup(groupKey, rowKeys);
    } else if (rowKey) {
      toggleRow(rowKey);
    }
  };

  return (
    <Tooltip isDisabled={!isDisabled} content={tooltipText} showArrow>
      <Checkbox
        isSelected={isSelected}
        isDisabled={isDisabled}
        onChange={handleChange}
      />
    </Tooltip>
  );
}
