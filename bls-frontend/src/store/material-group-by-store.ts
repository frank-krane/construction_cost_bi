import { MaterialTableGroupBy } from '@/app/constants/types'
import { create } from 'zustand'

export interface GroupByState {
    groupBy: MaterialTableGroupBy
    setGroupBy: (groupBy: MaterialTableGroupBy) => void
}

export const useGroupByStore = create<GroupByState>()((set) => ({
    groupBy: MaterialTableGroupBy.Material,
    setGroupBy: (groupBy: MaterialTableGroupBy) => set({ groupBy }),
}))