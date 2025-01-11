import { MaterialChartPeriod } from '@/app/constants/types'
import { create } from 'zustand'

/**
 * Tracks the selected time period for material charts
 */
export interface DurationState {
    duration: MaterialChartPeriod
    setDuration: (duration: MaterialChartPeriod) => void
}

/**
 * Zustand store for managing chart duration settings
 */
export const useDurationStore = create<DurationState>()((set) => ({
    duration: MaterialChartPeriod.FiveYears,
    setDuration: (duration: MaterialChartPeriod) => set({ duration }),
}))