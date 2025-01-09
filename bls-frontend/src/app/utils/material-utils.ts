import {
    MaterialDetail,
    MaterialDataRow,
    MaterialTableGroupBy,
    MaterialDataGroup,
} from "../constants/types";

// Convert each MaterialDetail -> MaterialDataRow[]
export function convertMaterialDetailToDataRows(
    detail: MaterialDetail
): MaterialDataRow[] {
    const seriesCount = detail.series.length;

    return detail.series.map((series) => ({
        key: series.id,
        materialName: detail.materialName,
        monthlyChange: series.monthlyChange,
        quarterlyChange: series.quarterlyChange,
        semiAnnualChange: series.semiAnnualChange,
        annualChange: series.annualChange,
        seriesId: series.seriesId,
        lastUpdated: series.lastUpdated,
        materialType: detail.materialType,
        regionName: series.region.regionName,
        seriesCount,
    }));
}

export function convertMaterialDetailsToDataRows(
    details: MaterialDetail[]
): MaterialDataRow[] {
    return details.flatMap((detail) => convertMaterialDetailToDataRows(detail));
}

// Group the data for display
export const groupMaterialData = (
    data: MaterialDataRow[],
    groupBy: MaterialTableGroupBy
): MaterialDataGroup[] => {
    const groupedData: { [key: string]: MaterialDataRow[] } = {};

    data.forEach((row) => {
        let groupKey: string;
        switch (groupBy) {
            case MaterialTableGroupBy.Type:
                groupKey = row.materialType;
                break;
            case MaterialTableGroupBy.Region:
                groupKey = row.regionName;
                break;
            case MaterialTableGroupBy.Material:
            default:
                groupKey = row.materialName;
                break;
        }

        if (!groupedData[groupKey]) {
            groupedData[groupKey] = [];
        }
        groupedData[groupKey].push(row);
    });

    return Object.entries(groupedData).map(([group, rows]) => ({
        group,
        rows,
    }));
};

/**
 * Debounce utility
 */
export function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delayMs: number
) {
    let timer: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn(...args);
            timer = null;
        }, delayMs);
    };
}

/**
 * General selection logic with a configurable max selection
 */
export function handleSelectionChange(
    key: string,
    currentSelection: Set<string>,
    totalSelected: number,
    maxSelection: number
): Set<string> {
    const newSelection = new Set(currentSelection);

    // If already selected, deselect
    if (newSelection.has(key)) {
        newSelection.delete(key);
        return newSelection;
    }

    // If at max capacity, ignore
    if (totalSelected >= maxSelection) {
        return newSelection;
    }

    // Otherwise, add
    newSelection.add(key);
    return newSelection;
}

/**
 * Toggle an entire group of items with a max selection constraint
 */
export function handleToggleGroup(
    currentSelection: Set<string>,
    rowKeys: string[],
    rangeToggle: boolean
): Set<string> {
    const newSet = new Set(currentSelection);

    const maxSelection = rangeToggle ? 1 : 5;

    // If the group is larger than our max, do nothing
    if (rowKeys.length > maxSelection) {
        return newSet;
    }

    // Check if all items in the group are already selected
    const allSelected = rowKeys.every((rk) => newSet.has(rk));

    if (allSelected) {
        // Deselect them all
        rowKeys.forEach((rk) => {
            newSet.delete(rk);
        });
    } else {
        // Select them up to the max
        for (const rk of rowKeys) {
            if (newSet.size < maxSelection) {
                newSet.add(rk);
            } else {
                break;
            }
        }
    }
    return newSet;
}

export function handleToggleRow(
    rowKey: string,
    currentSelection: Set<string>,
    rangeToggle: boolean
): Set<string> {
    const maxSelection = rangeToggle ? 1 : 5;
    return handleSelectionChange(
        rowKey,
        currentSelection,
        currentSelection.size,
        maxSelection
    );
}
