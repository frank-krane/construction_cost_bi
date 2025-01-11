import MaterialChart from "./material-chart";
import MaterialChartTabs from "./material-chart-tabs";
import MaterialChartToggle from "./material-chart-toggle";

/**
 * Renders the MaterialChartWrapper component.
 */
export default function MaterialChartWrapper() {
  return (
    <div>
      <div className="p-1">
        <MaterialChartTabs />
      </div>
      <div className="flex justify-end p-4">
        <MaterialChartToggle />
      </div>
      <div>
        <MaterialChart />
      </div>
    </div>
  );
}
