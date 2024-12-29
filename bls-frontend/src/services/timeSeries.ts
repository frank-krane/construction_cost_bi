import { TimeSeriesData } from "../types/timeSeries";
import { get } from "../utils/http";

const TIME_SERIES_API_URL = "http://localhost:5000/api/time_series/predict";

export async function getTimeSeriesData(seriesId: number, includeForecast: boolean, duration: string): Promise<TimeSeriesData> {
    const url = `${TIME_SERIES_API_URL}/${seriesId}?duration=${duration}&include_forecast=${includeForecast}`;
    return get<TimeSeriesData>(url);
}
