"use client";

import { create } from "zustand";
import {
    handleToggleGroup,
    handleToggleRow,
} from "@/app/utils/material-utils";
import { useForecastToggleStore } from "@/store/include-forecast-store";

/**
 * Manages selected material keys with optional range toggle
 */
interface MaterialSelectionState {
    selectedKeys: Set<string>;
    setSelection: (keys: Set<string>) => void;
    clearSelection: () => void;
    toggleGroup: (groupKey: string, rowKeys: string[]) => void;
    toggleRow: (rowKey: string) => void;
}

/**
 * Zustand store for material selection management
 */
export const useMaterialSelectionStore = create<MaterialSelectionState>()(
    (set, get) => ({
        selectedKeys: new Set(),

        setSelection: (keys: Set<string>) => set({ selectedKeys: keys }),

        clearSelection: () => set({ selectedKeys: new Set() }),

        toggleGroup: (_groupKey: string, rowKeys: string[]) => {
            const current = get().selectedKeys;

            const rangeToggle = useForecastToggleStore.getState().rangeToggle;
            const newSelection = handleToggleGroup(current, rowKeys, rangeToggle);

            set({ selectedKeys: newSelection });
        },

        toggleRow: (rowKey: string) => {
            const current = get().selectedKeys;

            const rangeToggle = useForecastToggleStore.getState().rangeToggle;
            const newSelection = handleToggleRow(rowKey, current, rangeToggle);

            set({ selectedKeys: newSelection });
        },
    })
);
