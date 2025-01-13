import MaterialChartWrapper from "@/components/material-chart/material-chart-wrapper";
import MaterialTableWrapper from "@/components/material-table/material-table-wrapper";

export default function Home() {
  return (
    <div className="w-full h-full">
      <div className="h-[10%]">
        <header className="p-8">
          <h1 className="text-4xl text-center">BLS Data Explorer</h1>
        </header>
      </div>
      <div className="flex h-[85%] p-2">
        <div className="table-wrapper w-1/2 h-full p-4">
          <MaterialTableWrapper />
        </div>
        <div className="chart-wrapper h-full w-1/2 p-4">
          <MaterialChartWrapper />
        </div>
      </div>
    </div>
  );
}
