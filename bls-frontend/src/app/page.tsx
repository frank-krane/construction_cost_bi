import MaterialChartWrapper from "@/components/material-chart/material-chart-wrapper";
import MaterialTableWrapper from "@/components/material-table/material-table-wrapper";

export default function Home() {
  return (
    <div className="flex w-full h-full">
      <div className="table-wrapper bg-green-200 h-full w-1/2">
        <MaterialTableWrapper />
      </div>
      <div className="chart-wrapper bg-blue-200 h-full w-1/2">
        <MaterialChartWrapper />
      </div>
    </div>
  );
}
