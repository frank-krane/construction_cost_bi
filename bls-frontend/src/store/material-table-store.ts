import { MaterialDetail } from '@/app/constants/types'
import { create } from 'zustand'

/**
 * Represents table data for materials
 */
export interface MaterialTableDataState {
    tableData: MaterialDetail[]
    setMaterialTableData: (tableData: MaterialDetail[]) => void
}

/**
 * Zustand store for managing material table data
 */
export const useMaterialTableStore = create<MaterialTableDataState>()((set) => ({
    tableData: [],
    setMaterialTableData: (tableData: MaterialDetail[]) => set({ tableData }),
}))