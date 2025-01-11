import { create } from "zustand";
import { TimeSeriesData } from "@/app/constants/types";

/**
 * Manages time series chart data
 */
interface ChartDataState {
    chartData: Record<string, TimeSeriesData | undefined>;

    setChartData: (newData: Record<string, TimeSeriesData>) => void;
}

/**
 * Zustand store for chart data
 */
export const useChartDataStore = create<ChartDataState>((set) => ({
    chartData: {},

    setChartData: (newData) =>
        set((state) => {
            const updated = { ...state.chartData };

            for (const [seriesId, data] of Object.entries(newData)) {
                updated[seriesId] = data;
            }

            return { chartData: updated };
        }),
}));
