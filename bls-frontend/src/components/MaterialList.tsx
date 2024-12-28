"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/table";
import { Material } from "../types/material";
import { getMaterialsDetailed } from "../services/materials";

interface DetailedDataRow {
  [key: string]: any;
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
  onSelectMaterial: (materialId: number, material: Material) => void;
}

const MaterialList: React.FC<MaterialListProps> = ({ onSelectMaterial }) => {
  const [detailedData, setDetailedData] = useState<any[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null);

  useEffect(() => {
    getMaterialsDetailed().then(setDetailedData).catch(console.error);
  }, []);

  const handleRowClick = (materialId: number) => {
    const material = detailedData.find((m) => m.materialId === materialId);
    if (material) {
      setSelectedMaterialId(materialId);
      onSelectMaterial(materialId, material);
    }
  };

  const rows: DetailedDataRow[] = detailedData.map((item) => ({
    key: item.materialId,
    materialName: item.materialName,
    monthlyChange: item.monthlyChange,
    quarterlyChange: item.quarterlyChange,
    semiAnnualChange: item.semiAnnualChange,
    annualChange: item.annualChange,
    lastUpdated: item.lastUpdated,
  }));

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
            className={selectedMaterialId === row.key ? "bg-gray-200" : ""}
          >
            {(columnKey) => {
              if (
                columnKey === "monthlyChange" ||
                columnKey === "quarterlyChange" ||
                columnKey === "semiAnnualChange" ||
                columnKey === "annualChange"
              ) {
                const change = row[columnKey];
                const isIncrease = change > 0;
                return (
                  <TableCell>
                    <span style={{ color: isIncrease ? "green" : "red" }}>
                      {change.toFixed(2)}%
                      {isIncrease ? " ↑" : " ↓"}
                    </span>
                  </TableCell>
                );
              }
              return <TableCell>{row[columnKey]}</TableCell>;
            }}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MaterialList;
