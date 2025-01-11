import { MaterialDetail } from "@/app/constants/types";
import { TimeSeriesDataResponse } from "@/app/constants/types";

const MATERIALS_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/materials`;

export const fetchMaterialsDetails = async (): Promise<MaterialDetail[]> => {
    try {
        const response = await fetch(`${MATERIALS_API_URL}/details`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result: MaterialDetail[] = await response.json();

        return result;
    } catch (error) {
        console.error("Error fetching materials details:", error);
        throw error;
    }
};

const TIME_SERIES_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/time_series/predict`;

export async function fetchTimeSeriesBatch(
    seriesIds: number[],
    includeForecast: boolean,
    duration: string
): Promise<TimeSeriesDataResponse> {
    const seriesIdsParam = seriesIds.join(",");
    const url = `${TIME_SERIES_API_URL}?series_ids=${seriesIdsParam}&duration=${duration}&include_forecast=${includeForecast}`;

    try {
        const response = await fetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result: TimeSeriesDataResponse = await response.json();

        return result;
    } catch (error) {
        console.error("Error fetching time series:", error);
        throw error;
    }
}




