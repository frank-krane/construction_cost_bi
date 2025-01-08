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

export function handleSelectionChange(
    key: string,
    currentSelection: Set<string>,
    totalSelected?: number
): Set<string> {
    const newSelection = new Set(currentSelection);

    if (newSelection.has(key)) {
        newSelection.delete(key);
        return newSelection;
    }

    if ((totalSelected ?? newSelection.size) >= 5) {
        return newSelection;
    }

    newSelection.add(key);
    return newSelection;
}

export function handleToggleGroup(
    currentSelection: Set<string>,
    rowKeys: string[]
): Set<string> {
    const newSet = new Set(currentSelection);

    if (rowKeys.length > 5) {
        return newSet;
    }

    const allSelected = rowKeys.every((rk) => newSet.has(rk));

    if (allSelected) {
        rowKeys.forEach((rk) => {
            newSet.delete(rk);
        });
    } else {
        for (const rk of rowKeys) {
            if (newSet.size < 5) {
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
    currentSelection: Set<string>
): Set<string> {
    return handleSelectionChange(rowKey, currentSelection, currentSelection.size);
}
