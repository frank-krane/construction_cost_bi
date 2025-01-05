import MaterialChart from "./material-chart";
import MaterialChartTabs from "./material-chart-tabs";
import MaterialChartToggle from "./material-chart-toggle";

export default function MaterialChartWrapper() {
  return (
    <div>
      <MaterialChartToggle />
      <MaterialChartTabs />
      <MaterialChart />
    </div>
  );
}
