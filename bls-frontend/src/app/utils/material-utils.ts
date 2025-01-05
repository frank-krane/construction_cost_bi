import { MaterialDetail, MaterialDataRow, MaterialTableGroupBy, MaterialDataGroup } from '../constants/types';

export function convertMaterialDetailToDataRows(detail: MaterialDetail): MaterialDataRow[] {
    const seriesCount = detail.series.length;

    return detail.series.map(series => ({
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
        seriesCount
    }));
}

export function convertMaterialDetailsToDataRows(details: MaterialDetail[]): MaterialDataRow[] {
    return details.flatMap(detail => convertMaterialDetailToDataRows(detail));
}

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


export function handleSelectionChange(
    keysFromNextUi: Set<string> | string[] | string,
    currentSelection: Set<string>,
    allNumericKeys: string[],
    groupedData: Record<string, string[]>, // group -> array of row keys
) {
    let newSelection = new Set<string>(
        Array.isArray(keysFromNextUi)
            ? keysFromNextUi
            : typeof keysFromNextUi === "string"
                ? [keysFromNextUi]
                : keysFromNextUi
    );

    // 1) Check if user just selected "all"
    const isAllNow = newSelection.has("all");
    const wasAllBefore = currentSelection.has("all");

    if (isAllNow && !wasAllBefore) {
        // The user is selecting all
        newSelection = new Set(["all", ...allNumericKeys]);
        // Also check if entire groups are selected
        for (const groupKey in groupedData) {
            const groupKeys = groupedData[groupKey];
            if (groupKeys.every((k) => newSelection.has(k))) {
                newSelection.add(groupKey);
            }
        }
        return newSelection;
    } else if (!isAllNow && wasAllBefore) {
        // The user just un-selected "all"
        newSelection.clear();
        return newSelection;
    }

    // 2) Group toggles
    for (const groupKey in groupedData) {
        const groupKeys = groupedData[groupKey];
        const isGroupSelected = newSelection.has(groupKey);
        const wasGroupSelected = currentSelection.has(groupKey);

        // If the user just selected a group
        if (isGroupSelected && !wasGroupSelected) {
            groupKeys.forEach((k) => newSelection.add(k));
        }
        // If user un-selected a group
        if (!isGroupSelected && wasGroupSelected) {
            groupKeys.forEach((k) => newSelection.delete(k));
        }
    }

    // 3) If all rows in a group are selected, mark the group as selected
    for (const groupKey in groupedData) {
        const groupKeys = groupedData[groupKey];
        const allInGroup = groupKeys.every((k) => newSelection.has(k));
        if (allInGroup) {
            newSelection.add(groupKey);
        } else {
            newSelection.delete(groupKey);
        }
    }

    // 4) Check if absolutely everything is selected
    const everythingSelected = allNumericKeys.every((k) => newSelection.has(k));
    if (everythingSelected) {
        newSelection.add("all");
    } else {
        newSelection.delete("all");
    }

    return newSelection;
}

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
