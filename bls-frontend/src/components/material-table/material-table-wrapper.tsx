import MaterialTable from "./material-table";
import MaterialTableTabs from "./material-table-tabs";

export default function MaterialTableWrapper() {
  return (
    <div className="flex flex-col max-h-full">
      <MaterialTableTabs />
      <MaterialTable />
    </div>
  );
}