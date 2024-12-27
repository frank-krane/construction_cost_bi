"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/table";
import { TimeSeriesData } from "../types/timeSeries";
import { getTimeSeriesData } from "../services/timeSeries";
import { Material } from "../types/material";

const columns = [
  { key: "material", label: "Material" },
  { key: "monthlyChange", label: "Monthly Change" },
  { key: "quarterlyChange", label: "Quarterly Change" },
  { key: "semiAnnualChange", label: "Semi-Annual Change" },
  { key: "annualChange", label: "Annual Change" },
  { key: "lastUpdated", label: "Last Updated" },
];

const TimeSeriesTable: React.FC<{ material: Material }> = ({ material }) => {
  const [data, setData] = React.useState<TimeSeriesData | null>(null);

  React.useEffect(() => {
    getTimeSeriesData(material.id).then(setData);
  }, [material.id]);

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

  if (!data) {
    return <div>Loading...</div>;
  }

  const latestData = data.existing_data[0];
  const monthlyChange = renderPercentChange(
    latestData.value,
    data.existing_data[1]?.value || latestData.value
  );
  const quarterlyChange = renderPercentChange(
    latestData.value,
    data.existing_data[3]?.value || latestData.value
  );
  const semiAnnualChange = renderPercentChange(
    latestData.value,
    data.existing_data[6]?.value || latestData.value
  );
  const annualChange = renderPercentChange(
    latestData.value,
    data.existing_data[11]?.value || latestData.value
  );

  const rows = [
    {
      key: material.id,
      material: material.name,
      monthlyChange,
      quarterlyChange,
      semiAnnualChange,
      annualChange,
      lastUpdated: `${latestData.year}-${latestData.month}`,
    },
  ];

  return (
    <Table aria-label="Time Series Data Table">
      <TableHeader>
        {columns.map((column) => (
          <TableColumn key={column.key}>{column.label}</TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.key}>
            {(columnKey) => <TableCell>{getKeyValue(row, columnKey)}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TimeSeriesTable;
