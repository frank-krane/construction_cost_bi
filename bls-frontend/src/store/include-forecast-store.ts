import { create } from 'zustand'

export interface ForecastToggleState {
    forecastToggle: boolean
    rangeToggle: boolean
    setForecastToggle: (forecastToggle: boolean) => void
    setRangeToggle: (rangeToggle: boolean) => void
}

export const useForecastToggleStore = create<ForecastToggleState>()((set) => ({
    forecastToggle: false,
    rangeToggle: false,
    setForecastToggle: (forecastToggle: boolean) => set({ forecastToggle }),
    setRangeToggle: (rangeToggle: boolean) => set({ rangeToggle })
}))
