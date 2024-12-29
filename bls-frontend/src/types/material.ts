export interface Series {
    seriesId: number;
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
    series: Series[];
}
