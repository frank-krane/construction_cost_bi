"use client";

import React, { useState } from "react";
import MaterialList from "../components/MaterialList";
import { Material } from "@/types/material";
import { TimeSeriesData } from "@/types/timeSeries";
import MaterialChart from "../components/MaterialChart";

export default function Home() {
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [selectedTimeSeriesData, setSelectedTimeSeriesData] = useState<TimeSeriesData | null>(null);

  const handleSelectMaterial = (materialId: number, material: Material, timeSeriesData: TimeSeriesData) => {
    setSelectedMaterialId(materialId);
    setSelectedMaterial(material);
    setSelectedTimeSeriesData(timeSeriesData);
  };

  return (
    <div className="grid grid-cols-2 min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <section className="flex flex-col gap-8 items-center sm:items-start">
        <h2 className="text-xl font-bold">Material List</h2>
        <MaterialList onSelectMaterial={handleSelectMaterial} />
      </section>
      <section className="flex flex-col gap-8 items-center sm:items-start">
        <h2 className="text-xl font-bold">Chart</h2>
        {selectedMaterialId !== null && selectedMaterial && selectedTimeSeriesData && (
          <div>
            <div>Selected Material ID: {selectedMaterialId}</div>
            <div>Material Name: {selectedMaterial.name}</div>
            <MaterialChart timeSeriesData={selectedTimeSeriesData} />
          </div>
        )}
      </section>
    </div>
  );
}
