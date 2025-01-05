import { create } from 'zustand'

export interface ForecastToggleState {
    forecastToggle: boolean
    setForecastToggle: (forecastToggle: boolean) => void
}

export const useForecastToggleStore = create<ForecastToggleState>()((set) => ({
    forecastToggle: false,
    setForecastToggle: (forecastToggle: boolean) => set({ forecastToggle }),
}))