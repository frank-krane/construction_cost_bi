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
import { TimeSeriesData } from "../types/timeSeries";
import { getMaterials } from "../services/materials";
import { getTimeSeriesData } from "../services/timeSeries";

const columns = [
  { key: "material", label: "Material" },
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
  const [materials, setMaterials] = useState<Material[]>([]);
  const [data, setData] = useState<Record<number, TimeSeriesData>>({});
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null);
  const [forecastEnabled, setForecastEnabled] = useState<boolean>(true);
  const [duration, setDuration] = useState<string>("5Y");

  useEffect(() => {
    getMaterials().then(setMaterials);
  }, []);

  useEffect(() => {
    if (materials.length > 0) {
      materials.forEach((material) => {
        getTimeSeriesData(material.id, forecastEnabled, duration).then((timeSeriesData) => {
          setData((prevData) => ({
            ...prevData,
            [material.id]: timeSeriesData,
          }));
        });
      });
    }
  }, [materials, forecastEnabled, duration]);

  const calculatePercentChange = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  const renderPercentChange = (current: number, previous: number) => {
    const percentChange = calculatePercentChange(current, previous);
    const isIncrease = percentChange > 0;
    return (
      <span style={{ color: isIncrease ? "green" : "red" }}>
        {percentChange.toFixed(2)}%
        {isIncrease ? " ↑" : " ↓"}
      </span>
    );
  };

  const handleRowClick = (materialId: number) => {
    const material = materials.find((m) => m.id === materialId);
    if (material) {
      setSelectedMaterialId(materialId);
      onSelectMaterial(materialId, material);
    }
  };

  const rows = materials.map((material) => {
    const timeSeriesData = data[material.id];
    if (!timeSeriesData) return null;

    const latestData = timeSeriesData.existing_data[0];
    const monthlyChange = renderPercentChange(
      latestData.value,
      timeSeriesData.existing_data[1]?.value || latestData.value
    );
    const quarterlyChange = renderPercentChange(
      latestData.value,
      timeSeriesData.existing_data[3]?.value || latestData.value
    );
    const semiAnnualChange = renderPercentChange(
      latestData.value,
      timeSeriesData.existing_data[6]?.value || latestData.value
    );
    const annualChange = renderPercentChange(
      latestData.value,
      timeSeriesData.existing_data[11]?.value || latestData.value
    );

    return {
      key: material.id,
      material: material.name,
      monthlyChange,
      quarterlyChange,
      semiAnnualChange,
      annualChange,
      lastUpdated: `${latestData.year}-${latestData.month}`,
    };
  }).filter((row): row is NonNullable<typeof row> => row !== null);

  return (
      <Table aria-label="Material List Table">
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.key}
              onClick={() => handleRowClick(row.key)}
              className={selectedMaterialId === row.key ? "bg-gray-200" : ""}
            >
              {(columnKey) => <TableCell>{getKeyValue(row, columnKey)}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
  );
};

export default MaterialList;
