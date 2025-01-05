import { create } from "zustand";
import { TimeSeriesData } from "@/app/constants/types";

interface ChartDataState {
    chartData: Record<string, TimeSeriesData | undefined>;

    setChartData: (newData: Record<string, TimeSeriesData>) => void;
}

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
