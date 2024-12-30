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

  return (
    <>
    <Tabs selectedKey={groupBy} onSelectionChange={(key) => setGroupBy(key as "type" | "region" | "material")}>
      <Tab key="type" title="Group by Type" />
      <Tab key="region" title="Group by Region" />
      <Tab key="material" title="Group by Material" />
    </Tabs><Table aria-label="Material List">
        <TableHeader>
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
                <TableCell>{groupBy === "material" && material.series.length > 1 ? `${material.materialName} - ${series.region.regionName}` : material.materialName}</TableCell>
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
