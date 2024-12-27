import { TimeSeriesData } from "../types/timeSeries";
import { get } from "../utils/http";

const TIME_SERIES_API_URL = "http://localhost:5000/api/time_series/predict";

export async function getTimeSeriesData(materialId: number): Promise<TimeSeriesData> {
    const url = `${TIME_SERIES_API_URL}/${materialId}?duration=5Y&include_forecast=true`;
    return get<TimeSeriesData>(url);
}
