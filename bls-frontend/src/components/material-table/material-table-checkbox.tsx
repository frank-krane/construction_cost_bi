"use client";

import { Checkbox } from "@nextui-org/checkbox";
import { Tooltip } from "@nextui-org/tooltip";
import { useMaterialSelectionStore } from "@/store/material-selection-store";
import { useForecastToggleStore } from "@/store/include-forecast-store";
import { ChangeEvent } from "react";

interface MaterialTableCheckboxProps {
  groupKey?: string;
  rowKeys?: string[];
  rowKey?: string;
  isDisabled?: boolean;
  disabledTooltip?: string;
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

  const maxItems = rangeToggle ? 1 : 5;
  const fallbackTooltip = `You can’t select more than ${maxItems} item${
    maxItems > 1 ? "s" : ""
  }.`;

  const tooltipText = disabledTooltip || fallbackTooltip;

  let isSelected = false;
  if (groupKey && rowKeys) {
    isSelected = rowKeys.every((rk) => selectedKeys.has(rk));
  } else if (rowKey) {
    isSelected = selectedKeys.has(rowKey);
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
