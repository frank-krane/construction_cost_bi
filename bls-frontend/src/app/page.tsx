import MaterialChartWrapper from "@/components/material-chart/material-chart-wrapper";
import MaterialTableWrapper from "@/components/material-table/material-table-wrapper";

export default function Home() {
  return (
    <div className="w-full h-full">
      <div className="h-[10%]">
        <header className="p-8"></header>
      </div>
      <div className="flex h-[90%] p-2">
        <div className="table-wrapper h-full w-1/2 p-4">
          <MaterialTableWrapper />
        </div>
        <div className="chart-wrapper h-full w-1/2 p-4">
          <MaterialChartWrapper />
        </div>
      </div>
    </div>
  );
}
