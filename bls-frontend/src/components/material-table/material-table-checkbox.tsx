"use client";

import { Checkbox } from "@nextui-org/checkbox";
import { Tooltip } from "@nextui-org/tooltip";
import { useMaterialSelectionStore } from "@/store/material-selection-store";
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
  disabledTooltip = "You can’t select more than 5 items",
}: MaterialTableCheckboxProps) {
  const { selectedKeys, toggleGroup, toggleRow } = useMaterialSelectionStore();

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
    <Tooltip isDisabled={!isDisabled} content={disabledTooltip} showArrow>
      <Checkbox
        isSelected={isSelected}
        isDisabled={isDisabled}
        onChange={handleChange}
      />
    </Tooltip>
  );
}
