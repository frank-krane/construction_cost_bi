import MaterialList from "../components/MaterialList"; // Import the MaterialList component

export default function Home() {
  return (
    <div className="grid grid-cols-2 min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <section className="flex flex-col gap-8 items-center sm:items-start">
        <h2 className="text-xl font-bold">Material List</h2>
        <MaterialList />
      </section>
      <section className="flex flex-col gap-8 items-center sm:items-start">
        <h2 className="text-xl font-bold">Chart</h2>
        {/* Add your chart component or content here */}
      </section>
    </div>
  );
}
