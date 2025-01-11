import { create } from "zustand";
import { useMaterialSelectionStore } from "@/store/material-selection-store";

/**
 * Tracks forecast and range toggles
 */
export interface ForecastToggleState {
    forecastToggle: boolean;
    rangeToggle: boolean;
    setForecastToggle: (forecastToggle: boolean) => void;
    setRangeToggle: (rangeToggle: boolean) => void;
}

/**
 * Zustand store for managing forecast and range toggles
 */
export const useForecastToggleStore = create<ForecastToggleState>()((set) => ({
    forecastToggle: false,
    rangeToggle: false,
    setForecastToggle: (forecastToggle: boolean) => set({ forecastToggle }),
    setRangeToggle: (rangeToggle: boolean) =>
        set(() => {
            if (rangeToggle) {
                const { selectedKeys, setSelection } =
                    useMaterialSelectionStore.getState();
                if (selectedKeys.size > 1) {
                    const [first] = selectedKeys;
                    setSelection(new Set([first]));
                }
            }
            return { rangeToggle };
        }),
}));
