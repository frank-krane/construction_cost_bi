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
