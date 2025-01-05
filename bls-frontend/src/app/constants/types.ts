export enum MaterialChartPeriod {
    OneYear = '1Y',
    FiveYears = '5Y',
    TenYears = '10Y',
    Max = 'Max'
}

export enum MaterialTableGroupBy {
    Material = 'Material',
    Region = 'Region',
    Type = 'Type'
}

export interface MaterialDataRow {
    key: number;
    materialName: string;
    monthlyChange: number;
    quarterlyChange: number;
    semiAnnualChange: number;
    annualChange: number;
    seriesId: string;
    lastUpdated: string;
    materialType: string;
    regionName: string;
    seriesCount: number;
}

export interface SeriesDetail {
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

export interface MaterialDetail {
    materialId: number;
    materialName: string;
    materialType: string;
    series: SeriesDetail[];
}

export interface MaterialDataGroup {
    group: string;
    rows: MaterialDataRow[];
}

interface ExistingData {
    ispredicted: boolean;
    month: number;
    value: number;
    year: number;
}

interface ForecastedData {
    ispredicted: boolean;
    month: number;
    year: number;
    yhat: number;
    yhat_lower: number;
    yhat_upper: number;
}

export interface TimeSeriesData {
    existing_data: ExistingData[];
    forecasted_data: ForecastedData[];
}

export interface TimeSeriesDataResponse {
    [seriesId: string]: TimeSeriesData;
}

