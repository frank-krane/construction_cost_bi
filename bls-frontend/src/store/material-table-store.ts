/*delete file*/
import { MaterialDetail } from '@/app/constants/types'
import { create } from 'zustand'

export interface MaterialTableDataState {
    tableData: MaterialDetail[]
    setMaterialTableData: (tableData: MaterialDetail[]) => void
}

export const useMaterialTableStore = create<MaterialTableDataState>()((set) => ({
    tableData: [],
    setMaterialTableData: (tableData: MaterialDetail[]) => set({ tableData }),
}))