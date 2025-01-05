import { MaterialChartPeriod } from '@/app/constants/types'
import { create } from 'zustand'

export interface DurationState {
    duration: MaterialChartPeriod
    setDuration: (duration: MaterialChartPeriod) => void
}

export const useDurationStore = create<DurationState>()((set) => ({
    duration: MaterialChartPeriod.FiveYears,
    setDuration: (duration: MaterialChartPeriod) => set({ duration }),
}))