export interface Series {
    id: number;
    seriesId: string;
    annualChange: number;
    lastUpdated: string;
    monthlyChange: number;
    quarterlyChange: number;
    semiAnnualChange: number;
    region: {
        regionId: number;
        regionName: string;
    };
}

export interface Material {
    materialId: number;
    materialName: string;
    materialType: string;
    series: Series[];
}
