import { MaterialTableGroupBy } from '@/app/constants/types'
import { create } from 'zustand'

/**
 * Manages the grouping logic for material table
 */
export interface GroupByState {
    groupBy: MaterialTableGroupBy
    setGroupBy: (groupBy: MaterialTableGroupBy) => void
}

/**
 * Zustand store for setting material grouping
 */
export const useGroupByStore = create<GroupByState>()((set) => ({
    groupBy: MaterialTableGroupBy.Material,
    setGroupBy: (groupBy: MaterialTableGroupBy) => set({ groupBy }),
}))