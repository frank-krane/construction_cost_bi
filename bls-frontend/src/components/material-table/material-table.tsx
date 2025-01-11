"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";

import {
  MaterialTableColumns,
  MaterialTypeMapping,
} from "@/app/constants/data";
import {
  convertMaterialDetailsToDataRows,
  groupMaterialData,
} from "@/app/utils/material-utils";
import { fetchMaterialsDetails } from "@/services/material-service";
import { MaterialDataRow, MaterialTableGroupBy } from "@/app/constants/types";
import { useMaterialSelectionStore } from "@/store/material-selection-store";
import { useGroupByStore } from "@/store/material-group-by-store";
import { useMaterialTableStore } from "@/store/material-table-store";
import { useForecastToggleStore } from "@/store/include-forecast-store";

import MaterialTableCheckbox from "./material-table-checkbox";

type DisplayItem = {
  isGroupHeader: boolean;
  groupKey?: string;
  rowData?: MaterialDataRow;
  rowKeys?: string[]; // needed if it's a group header
  displayGroup?: string; // label for the group
};

export default function MaterialTable() {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [materialRowData, setMaterialRowData] = useState<MaterialDataRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const groupBy = useGroupByStore((s) => s.groupBy);
  const { selectedKeys } = useMaterialSelectionStore();
  const { rangeToggle } = useForecastToggleStore(); // range toggle from forecast store

  const handleFetch = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const result = await fetchMaterialsDetails();
      setMaterialRowData(convertMaterialDetailsToDataRows(result));
      useMaterialTableStore.setState({ tableData: result });
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  // Group the data
  const groupedData = groupMaterialData(materialRowData, groupBy);

  // Flatten into a "displayItems" array
  const displayItems: DisplayItem[] = [];
  groupedData.forEach(({ group, rows }) => {
    // Decide if we need a group header row
    const isHeaderRendered =
      groupBy === MaterialTableGroupBy.Material && rows.length <= 1
        ? false
        : true;

    if (isHeaderRendered) {
      const displayGroup =
        groupBy === MaterialTableGroupBy.Type
          ? MaterialTypeMapping[group]
          : group;
      displayItems.push({
        isGroupHeader: true,
        groupKey: group,
        rowKeys: rows.map((r) => r.key.toString()),
        displayGroup,
      });
    }

    // Then detail rows
    rows.forEach((row) => {
      displayItems.push({
        isGroupHeader: false,
        rowData: row,
      });
    });
  });

  // For columns, we define the "selection" column plus normal columns:
  const columns = [
    { key: "selection", label: "", width: "40px" },
    ...MaterialTableColumns,
  ];

  // We'll create a helper to render each cell based on columnKey:
  const renderCell = (item: DisplayItem, columnKey: string) => {
    // If it's the group header:
    if (item.isGroupHeader) {
      if (columnKey === "selection") {
        const groupSize = item.rowKeys ? item.rowKeys.length : 0;

        // If range is on, max = 1, so disable the group checkbox if groupSize > 1
        const isDisabled = rangeToggle ? groupSize > 1 : groupSize > 5;

        return (
          <TableCell>
            <MaterialTableCheckbox
              groupKey={item.groupKey}
              rowKeys={item.rowKeys}
              isDisabled={isDisabled}
            />
          </TableCell>
        );
      }
      // The first actual data column: we'll display the group name in the first column only
      if (columnKey === MaterialTableColumns[0].key) {
        return (
          <TableCell className="font-bold bg-gray-50 text-gray-600">
            {item.displayGroup}
          </TableCell>
        );
      }
      // Otherwise, just an empty cell for the group row
      return <TableCell className="bg-gray-50">{""}</TableCell>;
    }

    // Otherwise, it's a detail row:
    const row = item.rowData!;
    if (columnKey === "selection") {
      // If range is on, max = 1
      const maxSelectionsReached = rangeToggle
        ? selectedKeys.size >= 1
        : selectedKeys.size >= 5;

      const isAlreadySelected = selectedKeys.has(row.key.toString());
      const isDisabled = maxSelectionsReached && !isAlreadySelected;

      return (
        <TableCell>
          <MaterialTableCheckbox
            rowKey={row.key.toString()}
            isDisabled={isDisabled}
          />
        </TableCell>
      );
    }

    // If it's a normal column, handle special formatting or fallback:
    if (columnKey === "materialName") {
      // If grouping by Type/Material and the row has multiple series, show region too
      if (
        [MaterialTableGroupBy.Type, MaterialTableGroupBy.Material].includes(
          groupBy
        ) &&
        row.seriesCount > 1
      ) {
        return (
          <TableCell>{`${row.materialName} - ${row.regionName}`}</TableCell>
        );
      }
      return <TableCell>{row.materialName}</TableCell>;
    }

    if (columnKey.endsWith("Change")) {
      const val = parseFloat(row[columnKey as keyof MaterialDataRow] as string);
      const colorClass = val > 0 ? "text-green-600" : "text-red-600";
      const arrow = val > 0 ? " ↑" : " ↓";
      return (
        <TableCell>
          <span className={colorClass}>{val.toFixed(2) + "%" + arrow}</span>
        </TableCell>
      );
    }

    // Default fallback:
    return <TableCell>{row[columnKey as keyof MaterialDataRow]}</TableCell>;
  };

  return (
    <div className="block overflow-auto h-full max-h-full">
      <Table aria-label="Materials Table" isHeaderSticky>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={displayItems}
          loadingState={isLoading ? "loading" : "idle"}
        >
          {(item) => (
            <TableRow
              key={
                item.isGroupHeader
                  ? `group-${item.groupKey}`
                  : item.rowData?.key
              }
              className={item.isGroupHeader ? "bg-gray-50" : ""}
            >
              {(columnKey) => renderCell(item, columnKey.toString())}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
