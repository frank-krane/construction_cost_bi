import { TimeSeriesData, TimeSeriesDataResponse } from "../types/timeSeries";
import { get } from "../utils/http";

const TIME_SERIES_API_URL = "http://localhost:5000/api/time_series/predict";

// Updated to accept an array of seriesIds
export async function getTimeSeriesData(seriesIds: number[], includeForecast: boolean, duration: string): Promise<TimeSeriesDataResponse> {
    const seriesIdsParam = seriesIds.join(",");
    const url = `${TIME_SERIES_API_URL}?series_ids=${seriesIdsParam}&duration=${duration}&include_forecast=${includeForecast}`;
    const data = await get<TimeSeriesDataResponse>(url);
    return data;
}
