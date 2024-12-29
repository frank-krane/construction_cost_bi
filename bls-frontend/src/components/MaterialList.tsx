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
  { key: "monthlyChange", label: "Monthly Change" },
  { key: "quarterlyChange", label: "Quarterly Change" },
  { key: "semiAnnualChange", label: "Semi-Annual Change" },
  { key: "annualChange", label: "Annual Change" },
  { key: "lastUpdated", label: "Last Updated" },
];

interface MaterialListProps {
  onSelectMaterial: (seriesId: number, material: Material) => void;
}

const MaterialList: React.FC<MaterialListProps> = ({ onSelectMaterial }) => {
  const [detailedData, setDetailedData] = useState<Material[]>([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState<number | null>(null);

  useEffect(() => {
    getMaterialsDetailed().then(setDetailedData).catch(console.error);
  }, []);

  const handleRowClick = (seriesId: number) => {
    const material = detailedData.find((m) => m.series.some((s: Series) => s.id === seriesId));
    if (material) {
      const series = material.series.find((s: Series) => s.id === seriesId);
      setSelectedSeriesId(seriesId);
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

  return (
    <Table aria-label="Material List Table">
      <TableHeader>
        {columns.map((c) => (
          <TableColumn key={c.key}>{c.label}</TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.key}
            onClick={() => handleRowClick(row.key)}
            className={selectedSeriesId === row.key ? "bg-gray-200" : ""}
          >
            {(columnKey) => {
              if (
                columnKey === "monthlyChange" ||
                columnKey === "quarterlyChange" ||
                columnKey === "semiAnnualChange" ||
                columnKey === "annualChange"
              ) {
                const change = row[columnKey as keyof DetailedDataRow];
                const isIncrease = typeof change === 'number' && change > 0;
                return (
                  <TableCell>
                    <span style={{ color: isIncrease ? "green" : "red" }}>
                      {typeof change === 'number' ? change.toFixed(2) : 'N/A'}%
                      {isIncrease ? " ↑" : " ↓"}
                    </span>
                  </TableCell>
                );
              }
              return <TableCell>{row[columnKey as keyof DetailedDataRow]}</TableCell>;
            }}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MaterialList;
