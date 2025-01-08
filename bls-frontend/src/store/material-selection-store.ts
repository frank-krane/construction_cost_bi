"use client";

import { create } from "zustand";
import {
    handleToggleGroup,
    handleToggleRow,
} from "@/app/utils/material-utils";

interface MaterialSelectionState {
    selectedKeys: Set<string>;
    setSelection: (keys: Set<string>) => void;
    clearSelection: () => void;
    toggleGroup: (groupKey: string, rowKeys: string[]) => void;
    toggleRow: (rowKey: string) => void;
}

export const useMaterialSelectionStore = create<MaterialSelectionState>()(
    (set, get) => ({
        selectedKeys: new Set(),

        setSelection: (keys: Set<string>) => set({ selectedKeys: keys }),

        clearSelection: () => set({ selectedKeys: new Set() }),

        toggleGroup: (_groupKey: string, rowKeys: string[]) => {
            const current = get().selectedKeys;
            const newSelection = handleToggleGroup(current, rowKeys);
            set({ selectedKeys: newSelection });
        },

        toggleRow: (rowKey: string) => {
            const current = get().selectedKeys;
            const newSelection = handleToggleRow(rowKey, current);
            set({ selectedKeys: newSelection });
        },
    })
);
