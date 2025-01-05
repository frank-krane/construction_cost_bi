export const MaterialTableColumns: { key: string; label: string }[] = [
    { key: "materialName", label: "Material" },
    { key: "monthlyChange", label: "Monthly Change" },
    { key: "quarterlyChange", label: "Quarterly Change" },
    { key: "semiAnnualChange", label: "Semi-Annual Change" },
    { key: "annualChange", label: "Annual Change" },
    { key: "seriesId", label: "Series ID" },
    { key: "lastUpdated", label: "Last Updated" }
];

export const MaterialTypeMapping: Record<string, string> = {
    ENERGY_AND_FREIGHT: "Energy and Freight",
    MANUFACTURING_LABOR_COST: "Manufacturing Labor Cost",
    MATERIAL: "Material",
};