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
  selectedKeys: string[];
  setSelectedKeys: (keys: string[]) => void;
}

const MaterialList: React.FC<MaterialListProps> = ({ selectedKeys, setSelectedKeys }) => {
  const [detailedData, setDetailedData] = useState<Material[]>([]);
  const [groupBy, setGroupBy] = useState<"type" | "region" | "material">("type");

  useEffect(() => {
    getMaterialsDetailed().then(setDetailedData).catch(console.error);
  }, []);

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

  const handleSelectionChange = (keys: Set<string> | string[] | string) => {
    let newKeys: Set<string>;
    if (typeof keys === "string") {
      newKeys = new Set([keys]);
    } else {
      newKeys = new Set(Array.isArray(keys) ? keys : [...keys]);
    }

    // Remove non-numeric keys (group headers and 'all')
    const numericSeriesIds = Array.from(newKeys).filter(key => /^\d+$/.test(key));

    setSelectedKeys(numericSeriesIds);
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
      <Table
        aria-label="Material List"
        selectedKeys={new Set(selectedKeys)}
        selectionMode="multiple"
        onSelectionChange={handleSelectionChange}
        isHeaderSticky={true}
      >
        <TableHeader aria-disabled={true}>
          {columns.map((c) => (
            <TableColumn key={c.key}>{c.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {Object.entries(groupedMaterials).flatMap(([group, items]) => {
            return [
              ...(groupBy !== "material" || items.length > 1 ? [
                <TableRow key={`${group}-header`} className="bg-gray-100 text-gray-600 rounded">
                  {columns.map((col, idx) => (
                    <TableCell key={col.key} className="font-bold text-xs">
                      {idx === 0 ? group : ""}
                    </TableCell>
                  ))}
                </TableRow>
              ] : []),
              ...items.map(({ material, series }) => (
                <TableRow key={series.id}>
                  <TableCell>
                    {["material", "type"].includes(groupBy) && material.series.length > 1
                      ? `${material.materialName} - ${series.region.regionName}`
                      : material.materialName}
                  </TableCell>
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
