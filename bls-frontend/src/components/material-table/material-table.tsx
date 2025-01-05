"use client";

import {
  MaterialTableColumns,
  MaterialTypeMapping,
} from "@/app/constants/data";
import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { useState, useEffect } from "react";
import { MaterialDataRow, MaterialTableGroupBy } from "@/app/constants/types";
import { fetchMaterialsDetails } from "@/services/material-service";
import {
  convertMaterialDetailsToDataRows,
  groupMaterialData,
} from "@/app/utils/material-utils";
import { useGroupByStore } from "@/store/material-group-by-store";
import React from "react";
import { useMaterialSelectionStore } from "@/store/material-selection-store";
import { useMaterialTableStore } from "@/store/material-table-store";

export default function MaterialTable() {
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [materialRowData, setMaterialRowData] = useState<MaterialDataRow[]>([]);
  const [isMaterialDataLoading, setIsMaterialDataLoading] =
    useState<boolean>(false);

  const groupBy = useGroupByStore((state) => state.groupBy);

  const handleFetch = async () => {
    setIsMaterialDataLoading(true);
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
      setIsMaterialDataLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  const groupedData = groupMaterialData(materialRowData, groupBy);

  const groupMap = groupedData.reduce<Record<string, string[]>>(
    (acc, { group, rows }) => {
      const rowKeys = rows.map((r) => r.key.toString());
      acc[group] = rowKeys;
      return acc;
    },
    {}
  );

  const allNumericKeys = Object.values(groupMap).flat();

  const { selectedKeys, updateSelection } = useMaterialSelectionStore();

  const handleSelectionChange = (
    keysFromNextUi: Set<string> | string[] | string
  ) => {
    updateSelection(keysFromNextUi, allNumericKeys, groupMap);
  };

  const renderMaterialNameCell = (
    item: MaterialDataRow,
    groupBy: MaterialTableGroupBy
  ) => {
    if (
      [MaterialTableGroupBy.Type, MaterialTableGroupBy.Material].includes(
        groupBy
      ) &&
      item.seriesCount > 1
    ) {
      return (
        <TableCell>{`${item.materialName} - ${item.regionName}`}</TableCell>
      );
    }
    return <TableCell>{item.materialName}</TableCell>;
  };

  const renderChangeCell = (item: MaterialDataRow, columnKey: string) => {
    const changeValue = parseFloat(getKeyValue(item, columnKey));
    const colorClass = changeValue > 0 ? "text-green-600" : "text-red-600";
    const arrow = changeValue > 0 ? " ↑" : " ↓";
    return (
      <TableCell>
        <span className={colorClass}>
          {changeValue.toFixed(2)}%{arrow}
        </span>
      </TableCell>
    );
  };

  const renderTableCell = (
    item: MaterialDataRow,
    columnKey: string,
    groupBy: MaterialTableGroupBy
  ) => {
    if (columnKey === "materialName") {
      return renderMaterialNameCell(item, groupBy);
    }

    if (columnKey.endsWith("Change")) {
      return renderChangeCell(item, columnKey);
    }

    return <TableCell>{getKeyValue(item, columnKey)}</TableCell>;
  };

  function renderGroupHeaderRow(
    group: string,
    rows: MaterialDataRow[],
    groupBy: MaterialTableGroupBy
  ) {
    const isHeaderRendered =
      groupBy === MaterialTableGroupBy.Material && rows.length <= 1;

    const displayGroup =
      groupBy === MaterialTableGroupBy.Type
        ? MaterialTypeMapping[group]
        : group;

    return isHeaderRendered ? null : (
      <TableRow key={group} className="bg-gray-100 text-gray-600 font-bold">
        {MaterialTableColumns.map((col, i) => (
          <TableCell key={`group-cell-${group}-${col.key}`}>
            {i === 0 ? displayGroup : ""}
          </TableCell>
        ))}
      </TableRow>
    );
  }

  function renderDetailRow(
    item: MaterialDataRow,
    renderTableCell: any,
    groupBy: MaterialTableGroupBy
  ) {
    return (
      <TableRow key={item.key}>
        {(columnKey) => renderTableCell(item, columnKey as string, groupBy)}
      </TableRow>
    );
  }

  return (
    <div className="block overflow-auto h-full max-h-full">
      <Table
        aria-label="Materials Table"
        isHeaderSticky
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
      >
        <TableHeader columns={MaterialTableColumns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody isLoading={isMaterialDataLoading}>
          {groupedData.map(({ group, rows }) => (
            <React.Fragment key={`group-fragment-${group}`}>
              {renderGroupHeaderRow(group, rows, groupBy)}
              {rows.map((item) =>
                renderDetailRow(item, renderTableCell, groupBy)
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
