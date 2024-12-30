"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Material, Series } from "../types/material";
import { getMaterialsDetailed } from "../services/materials";
import { Tabs, Tab } from "@nextui-org/tabs";

interface DetailedDataRow {
  key: number;
  materialName: string;
  monthlyChange: number;
  quarterlyChange: number;
  semiAnnualChange: number;
  annualChange: number;
  lastUpdated: string;
}

const columns: { key: string; label: string }[] = [
  { key: "materialName", label: "Material" },
  { key: "seriesId", label: "Series ID" },
  { key: "lastUpdated", label: "Last Updated" },
  { key: "monthlyChange", label: "Monthly Change" },
  { key: "quarterlyChange", label: "Quarterly Change" },
  { key: "semiAnnualChange", label: "Semi-Annual Change" },
  { key: "annualChange", label: "Annual Change" },
];

interface MaterialListProps {
  onSelectMaterial: (seriesId: number, material: Material) => void;
}

const MaterialList: React.FC<MaterialListProps> = ({ onSelectMaterial }) => {
  const [detailedData, setDetailedData] = useState<Material[]>([]);
  const [groupBy, setGroupBy] = useState<"type" | "region" | "material">("type");

  useEffect(() => {
    getMaterialsDetailed().then(setDetailedData).catch(console.error);
  }, []);

  const handleRowClick = (seriesId: number) => {
    const material = detailedData.find((m) => m.series.some((s: Series) => s.id === seriesId));
    if (material) {
      const series = material.series.find((s: Series) => s.id === seriesId);
      onSelectMaterial(seriesId, material);
    }
  };

  const rows: DetailedDataRow[] = detailedData.flatMap((item) =>
    item.series.map((series: Series) => ({
      key: series.id,
      materialName: item.materialName,
      monthlyChange: series.monthlyChange,
      quarterlyChange: series.quarterlyChange,
      semiAnnualChange: series.semiAnnualChange,
      annualChange: series.annualChange,
      lastUpdated: series.lastUpdated,
    }))
  );

  const groupedMaterials = detailedData.reduce((acc, material) => {
    material.series.forEach((series) => {
      let key;
      if (groupBy === "type") {
        key = material.materialType;
      } else if (groupBy === "region") {
        key = series.region.regionName;
      } else {
        key = material.materialName;
      }
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push({ material, series });
    });
    return acc;
  }, {} as Record<string, { material: Material; series: Series }[]>);

  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);
  const [prevSelection, setPrevSelection] = React.useState<Set<string>>(new Set());

  const handleSelectionChange = (keys: Set<string> | string[] | string) => {
    console.log(keys);
    if (typeof keys === "string") {
      keys = [keys];
    }
    const oldKeys = new Set(prevSelection);
    const newKeys = new Set(Array.isArray(keys) ? keys : [...keys]);

    // Handle 'all' key toggle
    const wasAllSelected = oldKeys.has('all');
    const isAllSelected = newKeys.has('all');

    if (!wasAllSelected && isAllSelected) {
      // 'all' was toggled to select all
      console.log("Table header checkbox selected (Select All).");
      rows.forEach(row => newKeys.add(row.key.toString()));
      // Add all group header keys
      Object.keys(groupedMaterials).forEach(group => newKeys.add(`${group}-header`));
    } else if (wasAllSelected && !isAllSelected) {
      // 'all' was toggled to deselect all
      console.log("Table header checkbox deselected (Deselect All).");
      rows.forEach(row => newKeys.delete(row.key.toString()));
      // Remove all group header keys
      Object.keys(groupedMaterials).forEach(group => newKeys.delete(`${group}-header`));
    }

    // Skip group header logic if 'all' was toggled
    if ((!wasAllSelected && isAllSelected) || (wasAllSelected && !isAllSelected)) {
      setSelectedKeys(Array.from(newKeys));
      setPrevSelection(newKeys);
      return;
    }

    // Step 1: Detect group header toggles
    Object.entries(groupedMaterials).forEach(([group, items]) => {
      const header = `${group}-header`;
      const itemIds = items.map(({ series }) => series.id.toString());

      // Header was just toggled on: select all group items
      if (!oldKeys.has(header) && newKeys.has(header)) {
        console.log(`Header '${group}' selected.`);
        itemIds.forEach((id) => newKeys.add(id));
      }
      // Header was just toggled off: unselect all group items
      if (oldKeys.has(header) && !newKeys.has(header)) {
        console.log(`Header '${group}' deselected.`);
        itemIds.forEach((id) => newKeys.delete(id));
      }
    });

    // Step 2: If all items in a group are now selected, ensure the group header is selected; else unselect it
    Object.entries(groupedMaterials).forEach(([group, items]) => {
      const header = `${group}-header`;
      const itemIds = items.map(({ series }) => series.id.toString());
      const allSelected = itemIds.every((id) => newKeys.has(id));
      if (allSelected) newKeys.add(header);
      else newKeys.delete(header);
    });

    const allItemKeys = rows.map(row => row.key.toString());
    const currentlyAllSelected = allItemKeys.every(key => newKeys.has(key));
    if (!currentlyAllSelected && newKeys.has('all')) {
      console.log("'all' key removed as not all items are selected.");
      newKeys.delete('all');
    }

    setSelectedKeys(Array.from(newKeys));
    setPrevSelection(newKeys);
  };

  return (
    <>
    <div>
    <Tabs selectedKey={groupBy} onSelectionChange={(key) => setGroupBy(key as "type" | "region" | "material")}>
      <Tab key="type" title="Group by Type" />
      <Tab key="region" title="Group by Region" />
      <Tab key="material" title="Group by Material" />
    </Tabs>
    </div>
    <Table aria-label="Material List" selectedKeys={selectedKeys} selectionMode="multiple" onSelectionChange={handleSelectionChange} isHeaderSticky={true}>
        <TableHeader aria-disabled={true}>
          {columns.map((c) => (
            <TableColumn key={c.key}>{c.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
            {Object.entries(groupedMaterials).flatMap(([group, items]) => {
            return [
              ...(groupBy !== "material" || items.length > 1? [
              <TableRow key={`${group}-header`} className="bg-gray-100 text-gray-600 rounded">
                {columns.map((col, idx) => (
                <TableCell key={col.key} className="font-bold text-xs">
                  {idx === 0 ? group : ""}
                </TableCell>
                ))}
              </TableRow>
              ] : []),
              ...items.map(({ material, series }) => (
              <TableRow key={series.id} onClick={() => handleRowClick(series.id)}>
                <TableCell>{["material", "type"].includes(groupBy) && material.series.length > 1 ? `${material.materialName} - ${series.region.regionName}` : material.materialName}</TableCell>
                <TableCell>{series.seriesId}</TableCell>
                <TableCell>{series.lastUpdated}</TableCell>
                <TableCell>
                <span style={{ color: series.monthlyChange > 0 ? "green" : "red" }}>
                  {series.monthlyChange.toFixed(2)}%
                  {series.monthlyChange > 0 ? " ↑" : " ↓"}
                </span>
                </TableCell>
                <TableCell>
                <span style={{ color: series.quarterlyChange > 0 ? "green" : "red" }}>
                  {series.quarterlyChange.toFixed(2)}%
                  {series.quarterlyChange > 0 ? " ↑" : " ↓"}
                </span>
                </TableCell>
                <TableCell>
                <span style={{ color: series.semiAnnualChange > 0 ? "green" : "red" }}>
                  {series.semiAnnualChange.toFixed(2)}%
                  {series.semiAnnualChange > 0 ? " ↑" : " ↓"}
                </span>
                </TableCell>
                <TableCell>
                <span style={{ color: series.annualChange > 0 ? "green" : "red" }}>
                  {series.annualChange.toFixed(2)}%
                  {series.annualChange > 0 ? " ↑" : " ↓"}
                </span>
                </TableCell>
              </TableRow>

              )),
            ];
            })}
        </TableBody>
      </Table>
      </>
  );
};

export default MaterialList;
