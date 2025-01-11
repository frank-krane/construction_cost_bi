import MaterialTable from "./material-table";
import MaterialTableTabs from "./material-table-tabs";

/**
 * Renders the MaterialTableWrapper component.
 */
export default function MaterialTableWrapper() {
  return (
    <div className="flex flex-col max-h-full">
      <div className="p-1">
        <MaterialTableTabs />
      </div>
      <MaterialTable />
    </div>
  );
}
