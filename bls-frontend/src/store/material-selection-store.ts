import { handleSelectionChange } from '@/app/utils/material-utils';
import { create } from 'zustand';

interface MaterialSelectionState {
    selectedKeys: Set<string>;
    setSelection: (keys: Set<string>) => void;
    clearSelection: () => void;
    updateSelection: (
        keysFromNextUi: Set<string> | string[] | string,
        allNumericKeys: string[],
        groupedData: Record<string, string[]>
    ) => void;
}

export const useMaterialSelectionStore = create<MaterialSelectionState>()((set) => ({
    selectedKeys: new Set(),
    setSelection: (keys: Set<string>) => set({ selectedKeys: keys }),
    clearSelection: () => set({ selectedKeys: new Set() }),
    updateSelection: (keys, allNumericKeys, groupedData) =>
        set((state) => ({
            selectedKeys: handleSelectionChange(
                keys,
                state.selectedKeys,
                allNumericKeys,
                groupedData
            ),
        })),
}));
